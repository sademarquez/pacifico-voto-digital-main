@echo off
REM Script TODO EN UNO: clean, build y deploy en emulador Android usando adb
setlocal

REM Ruta completa de adb.exe (ajusta si es necesario)
set ADB_PATH=C:\Users\USUARIO\AppData\Local\Android\Sdk\platform-tools\adb.exe

REM Limpiar build anterior usando WSL
wsl bash -c "cd /mnt/c/Users/USUARIO/Downloads/pacifico-voto-digital-main/agora_mobile && buildozer -v android clean"
if %ERRORLEVEL% NEQ 0 (
    echo Error al limpiar el proyecto con Buildozer.
    pause
    exit /b 1
)

REM Compilar el APK usando WSL
wsl bash -c "cd /mnt/c/Users/USUARIO/Downloads/pacifico-voto-digital-main/agora_mobile && buildozer -v android debug"
if %ERRORLEVEL% NEQ 0 (
    echo Error al compilar el APK con Buildozer.
    pause
    exit /b 1
)

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