@echo off
title CYBER-COUNT CALCUN8R // Dedicated Fullscreen Mode
echo ====================================================================
echo  CYBER-COUNT CALCUN8R v4.2 // EDISON HWY BEVERAGE LOGISTICS
echo  Launching Dedicated Fullscreen Monitor View (100%% Monitor Display)
echo ====================================================================
echo.

:: Launch in Chrome Fullscreen App Mode
start "" chrome.exe --app="file:///%~dp0index.html" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto end

:: Fallback to Microsoft Edge Fullscreen App Mode
start "" msedge.exe --app="file:///%~dp0index.html" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto end

:: Fallback to Default Browser
start "" "%~dp0index.html"

:end
exit
