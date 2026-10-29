@echo off
echo ====================================
echo  Starting Portfolio Auto-Deploy...
echo ====================================

git add .

set /p msg="Enter commit message: "
git commit -m "%msg%"

git push

echo ====================================
echo  Pushed to GitHub! Vercel is updating...
echo ====================================
pause