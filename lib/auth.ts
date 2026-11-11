import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'robiulnil101@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন');
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // 1. Check Master Admin Credentials
        const adminEmail = (process.env.ADMIN_EMAIL || 'robiulnil101@gmail.com').toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || 'RABIUL@20';

        if (email === adminEmail && password === adminPassword) {
          let adminImage: string | null = null;
          try {
            const dbAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
            if (dbAdmin?.image) adminImage = dbAdmin.image;
          } catch {}

          return {
            id: 'admin-master-id',
            name: 'শিক্ষানোভা অ্যাডমিন (shikkhanova Admin)',
            email: adminEmail,
            role: 'ADMIN' as Role,
            classGrade: null,
            rollNumber: null,
            phone: '01712592519',
            image: adminImage,
          };
        }

        // 2. Query Database for Registered Users
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error('এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি');
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            classGrade: user.classGrade,
            rollNumber: user.rollNumber,
            phone: user.phone,
            image: user.image,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'অথেনটিকেশন সমস্যা হয়েছে');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.classGrade = user.classGrade;
        token.rollNumber = user.rollNumber;
        token.phone = (user as any).phone;
        token.picture = (user as any).image;
      }
      if (trigger === 'update' && session?.user) {
        if (session.user.image) token.picture = session.user.image;
        if (session.user.name) token.name = session.user.name;
        if (session.user.phone !== undefined) token.phone = session.user.phone;
        if (session.user.classGrade !== undefined) token.classGrade = session.user.classGrade;
        if (session.user.rollNumber !== undefined) token.rollNumber = session.user.rollNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.classGrade = token.classGrade as number | null;
        session.user.rollNumber = token.rollNumber as number | null;
        session.user.phone = token.phone as string | null;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'shikkhanova-super-secret-jwt-key-2026-rabiul20',
};

