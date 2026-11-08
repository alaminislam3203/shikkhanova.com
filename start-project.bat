@echo off
chcp 65001 >nul
echo ========================================================
echo  🎓 শিক্ষানোভা (SikkhaNova) - Project Launcher
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Cleaning and organizing assets in their proper locations...
call node scripts/clean-assets.js

echo.
echo [2/3] Pushing Prisma schema to PostgreSQL...
call npx prisma db push

echo.
echo [3/3] Starting Next.js Development Server...
echo 🌐 সাইটটি ব্রাউজারে চালু হচ্ছে: http://localhost:3000
start http://localhost:3000
call npm run dev

pause
