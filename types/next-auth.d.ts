import { Role } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      classGrade?: number | null;
      rollNumber?: number | null;
      phone?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
    classGrade?: number | null;
    rollNumber?: number | null;
    phone?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    classGrade?: number | null;
    rollNumber?: number | null;
  }
}

