@echo off
rem Sort inbox/ into folders and rebuild CONTEXT.md. Double-click, or run: hub.cmd [all|ingest|index|check]
cd /d "%~dp0"
node ".hub\hub.cjs" %*
if "%~1"=="" pause
