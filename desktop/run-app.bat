@echo off
title UyFox News - Windows ئۈستەلئۈستى پىروگراممىسى
chcp 65001 > nul
echo ========================================================
echo   UyFox News - Windows 11 Enterprise Suite
echo   شەرقىي تۈركىستان ۋە دۇنيا گېئوپولىتىكىلىق خەۋەر مەركىزى
echo ========================================================
echo.
echo پىروگرامما قوزغىتىلىۋاتىدۇ...
echo.

rem 1. ئەگەر Electron ئورنىتىلغان بولسا، تاق تۈزۈملۈك پىروگرامما سۈپىتىدە قوزغىتىش
if exist "%~dp0node_modules\electron" (
    start "" "%~dp0node_modules\.bin\electron.cmd" "%~dp0."
    exit /b
)

rem 2. ئەگەر Microsoft Edge ياكى Chrome بار بولسا، ئەپ شەكلىدە (Standalone Window) قوزغىتىش
set "APP_URL=file:///%~dp0index.html"

where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app="%APP_URL%" --window-size=1280,820
    exit /b
)

where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app="%APP_URL%" --window-size=1280,820
    exit /b
)

rem 3. سۈكۈتتىكى تور كۆرگۈچتە تۈز بىۋاسىتە ئېچىش
start "" "%~dp0index.html"
