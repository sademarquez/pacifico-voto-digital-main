#!/bin/bash
set -e

# 1. Instalar dependencias del sistema
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-setuptools git python3 python3-venv zip unzip openjdk-8-jdk adb

# 2. Instalar buildozer y cython con el flag especial si es necesario
if python3 --version | grep -q '3.12'; then
  echo "Detectado Python 3.12, usando --break-system-packages para pip."
  pip3 install --user buildozer cython --break-system-packages
else
  pip3 install --user buildozer cython
fi

# 3. Verificar herramientas
java -version
adb version
~/.local/bin/buildozer --version

# 4. Navegar al proyecto
cd /mnt/c/Users/USUARIO/Downloads/pacifico-voto-digital-main/agora_mobile

# 5. Limpiar y compilar el APK
rm -rf .buildozer
~/.local/bin/buildozer -v android clean
~/.local/bin/buildozer -v android debug

# 6. Buscar el último APK generado
APK_PATH=$(ls -t bin/*.apk | head -n 1)
if [ ! -f "$APK_PATH" ]; then
  echo "No se encontró un APK en bin/"
  exit 1
fi

# 7. Instalar el APK en el emulador Android
deb_devices=$(adb devices | grep -w 'device' | wc -l)
if [ "$deb_devices" -eq 0 ]; then
  echo "No se detectó ningún emulador o dispositivo Android conectado."
  exit 1
fi
adb install -r "$APK_PATH"
if [ $? -eq 0 ]; then
  echo "¡APK instalado correctamente en el emulador/dispositivo!"
else
  echo "Error al instalar el APK. ¿Está el emulador/dispositivo corriendo y autorizado?"
fi
