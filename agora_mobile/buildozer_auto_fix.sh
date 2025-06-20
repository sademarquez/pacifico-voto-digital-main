#!/bin/bash
set -e
cd /mnt/c/Users/USUARIO/Downloads/pacifico-voto-digital-main/agora_mobile
# 1. Verifica que estés en la carpeta correcta
if [ ! -f buildozer.spec ]; then
  echo "ERROR: No se encontró buildozer.spec en la carpeta actual."
  exit 1
fi

# 2. Agrega pip_options si no existe
if ! grep -q "pip_options = --break-system-packages" buildozer.spec; then
  echo "Agregando pip_options = --break-system-packages a buildozer.spec"
  echo "" >> buildozer.spec
  echo "pip_options = --break-system-packages" >> buildozer.spec
fi

# 3. Limpia el build anterior
echo "Limpiando build anterior..."
rm -rf .buildozer

# 4. Compila el APK
echo "Compilando APK con Buildozer..."
if ! ~/.local/bin/buildozer -v android debug; then
  echo "ERROR: Falló la compilación con Buildozer."
  echo "Revisa los mensajes de error anteriores."
  exit 2
fi

# 5. Verifica si el APK fue generado
APK_PATH=$(ls -t /mnt/c/Users/USUARIO/Downloads/pacifico-voto-digital-main/agora_mobile/bin/*.apk 2>/dev/null | head -n 1)
if [ ! -f "$APK_PATH" ]; then
  echo "ERROR: No se generó ningún APK en la carpeta bin/"
  exit 3
fi

echo "¡APK generado correctamente en $APK_PATH!"
echo "Para instalarlo en tu dispositivo o emulador, ejecuta:"
echo "/mnt/c/Users/USUARIO/AppData/Local/Android/Sdk/platform-tools/adb.exe install -r $APK_PATH"
