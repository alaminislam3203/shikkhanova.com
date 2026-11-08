@echo off
chcp 65001 >nul
echo ========================================================
echo  🚀 শিক্ষানোভা (SikkhaNova) - GitHub Push & Asset Organizer
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Resetting local commits back to origin/main (Keeping all code files safe)...
git reset origin/main

echo [2/5] Cleaning and organizing assets in their proper locations...
call node scripts/clean-assets.js

echo [3/5] Staging only clean project source code (node_modules is strictly ignored)...
git add .

echo [4/5] Creating a clean single commit...
git commit -m "chore: organize assets into proper directories and remove redundant duplicate files"

echo [5/5] Pushing to origin main (GitHub)...
git push origin main

echo.
echo ========================================================
echo  ✅ GitHub-এ সফলভাবে ১০০%% পুশ সম্পন্ন হয়েছে!
echo  🌐 Repo: https://github.com/alaminislam3203/shikkhanova.com.git
echo ========================================================
echo.
pause
