const { execSync } = require('child_process');

// Ensure DATABASE_URL is set so Prisma generate never fails on build containers
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://neondb_owner:dummy@ep-dummy-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
}

try {
  console.log('⚡ Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🚀 Building Next.js Application...');
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build step failed:', error);
  process.exit(1);
}

