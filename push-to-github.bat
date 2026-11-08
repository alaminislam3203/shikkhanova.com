@echo off
chcp 65001 >nul
echo ========================================================
echo  🚀 শিক্ষানোভা (SikkhaNova) - GitHub Push & Large File Fix
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Resetting local commits back to origin/main (Keeping all code files safe)...
git reset origin/main

echo [2/5] Ensuring logos and bkash/nagad icons are synced to public folders...
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

echo [3/5] Staging only clean project source code (node_modules is strictly ignored)...
git add .

echo [4/5] Creating a clean single commit...
git commit -m "feat: complete SikkhaNova platform with official logos, OpenGraph SEO, and clean UI"

echo [5/5] Pushing to origin main (GitHub)...
git push origin main

echo.
echo ========================================================
echo  ✅ GitHub-এ সফলভাবে ১০০%% পুশ সম্পন্ন হয়েছে!
echo  🌐 Repo: https://github.com/alaminislam3203/shikkhanova.com.git
echo ========================================================
echo.
pause
