@echo off
title Push Quantoom Root to GitHub
echo =======================================================
echo  ⚛️  PUSHING QUANTOOM ROOT TO GITHUB
echo  Target: https://github.com/yourbuddyXML69/Quantum-root
echo =======================================================
echo.
echo Make sure you have created the empty repository on GitHub:
echo https://github.com/new (Name: quantoom-root)
echo.
echo Pushing to main branch...
git push -u origin main --force
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Repository pushed to https://github.com/yourbuddyXML69/Quantum-root
) else (
    echo [NOTE] If you saw an authentication or 404 error, make sure the repo exists at:
    echo https://github.com/new and sign in via the browser popup.
)
pause
