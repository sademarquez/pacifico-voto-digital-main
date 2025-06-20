@echo off
REM Script para instalar automáticamente el APK generado en el emulador Android usando la ruta completa de adb
setlocal

REM Ruta completa de adb.exe (ajusta si es necesario)
set ADB_PATH=C:\Users\USUARIO\AppData\Local\Android\Sdk\platform-tools\adb.exe

REM Buscar el último APK generado
dir /b /od ..\bin\*.apk > tmp_apk_list.txt
set APK=
for /f "delims=" %%a in (tmp_apk_list.txt) do set APK=..\bin\%%a
if not exist "%APK%" (
    echo No se encontró un APK en ..\bin\
    del tmp_apk_list.txt
    exit /b 1
)

echo Verificando dispositivos conectados...
"%ADB_PATH%" devices

echo Instalando %APK% en el emulador...
"%ADB_PATH%" install -r "%APK%"

del tmp_apk_list.txt

if %ERRORLEVEL%==0 (
    echo ¡APK instalado correctamente en el emulador!
) else (
    echo Error al instalar el APK. ¿Está el emulador corriendo y autorizado?
)
pause 