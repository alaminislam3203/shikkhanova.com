@echo off
chcp 65001 >nul
echo ========================================================
echo  🎓 শিক্ষানোভা (SikkhaNova) - Project Launcher
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Syncing brand logo, bkash, and nagad icons to public folders...
if exist logo.png (
  copy /y logo.png public\logo.png >nul
  if not exist public\assets\logos mkdir public\assets\logos
  copy /y logo.png public\assets\logos\logo.png >nul
)
if exist public\assets\images\bkash.png (
  copy /y public\assets\images\bkash.png public\bkash.png >nul
)
if exist public\assets\images\nagad.png (
  copy /y public\assets\images\nagad.png public\nagad.png >nul
)
if exist index.html del /f /q index.html >nul 2>&1
if exist app.js del /f /q app.js >nul 2>&1

echo [2/4] Pushing Prisma schema to PostgreSQL...
call npx prisma db push

echo.
echo [3/4] Starting Next.js Development Server...
echo 🌐 সাইটটি ব্রাউজারে চালু হচ্ছে: http://localhost:3000
start http://localhost:3000
call npm run dev

pause

