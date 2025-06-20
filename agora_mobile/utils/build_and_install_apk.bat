@echo off
REM Script para compilar el APK con Buildozer y luego instalarlo en el emulador Android (Windows)
cd ..

REM Compilar el APK
buildozer -v android debug
if %ERRORLEVEL% NEQ 0 (
    echo Error al compilar el APK con Buildozer.
    pause
    exit /b 1
)

cd utils
call install_apk_emulador.bat 