const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Auto-copy user-uploaded grading image if available
try {
  const src = 'C:\\Users\\AL AMIN\\.gemini\\antigravity\\brain\\ac40c9e4-9e84-4560-92b8-3fe0bb211df5\\.user_uploaded\\media_1794339585242_c5d7cc14.png';
  const dst = path.join(__dirname, '..', 'public', 'nctb-mark-grading.png');
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
  }
} catch {}

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

