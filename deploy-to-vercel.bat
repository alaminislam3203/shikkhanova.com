@echo off
chcp 65001 >nul
echo ========================================================
echo  🚀 শিক্ষানোভা (SikkhaNova) - Vercel Deployment Assistant
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] অ্যাসেট ক্লিনআপ ও প্রডাকশন রেডি করা হচ্ছে...
call node scripts/clean-assets.js

echo.
echo [2/3] গিটহাবে লেটেস্ট কোড পুশ করা হচ্ছে...
git reset origin/main
git add .
git commit -m "deploy: prepare project for Vercel production deployment with Prisma generate"
git push origin main

echo.
echo [3/3] গিটহাবে কোড সফলভাবে পুশ সম্পন্ন হয়েছে!
echo.
echo ========================================================
echo  🌐 Vercel-এ ডিপ্লয় করার ২টি সহজ উপায়:
echo ========================================================
echo.
echo  উপায় ১ (সবচেয়ে সহজ - Vercel ড্যাশবোর্ড থেকে এক ক্লিকে):
echo  ১. ব্রাউজারে যান: https://vercel.com/new
echo  ২. Import Git Repository থেকে shikkhanova.com সিলেক্ট করুন
echo  ৩. Environment Variables এ .env এর মানগুলো দিয়ে Deploy চাপুন!
echo.
echo  উপায় ২ (সরাসরি টার্মিনাল Vercel CLI দিয়ে):
echo  -------------------------------------------------------
set /p runCli="কমান্ড লাইনে npx vercel দিয়ে এখনই ডিপ্লয় শুরু করতে চান? (y/n): "
if /i "%runCli%"=="y" (
    echo.
    echo 🚀 Vercel CLI চালু করা হচ্ছে...
    call npx vercel --prod
)

echo.
echo সম্পন্ন হয়েছে!
pause
