#!/bin/bash
# Script TODO EN UNO para WSL: instala dependencias, compila APK y lo instala en el dispositivo Android
set -e

# 1. Instalar dependencias
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-setuptools git python3 python3-venv zip unzip openjdk-8-jdk adb
pip3 install --user cython buildozer

# 2. Compilar el APK
cd "$(dirname "$0")/.."
echo "Compilando APK con Buildozer..."
buildozer -v android debug

# 3. Buscar el último APK generado
echo "Buscando el último APK generado..."
APK_PATH=$(ls -t bin/*.apk | head -n 1)
if [ ! -f "$APK_PATH" ]; then
  echo "No se encontró un APK en bin/"
  exit 1
fi

# 4. Instalar el APK en el dispositivo Android
adb devices
adb install -r "$APK_PATH"
if [ $? -eq 0 ]; then
  echo "¡APK instalado correctamente en el dispositivo Android!"
else
  echo "Error al instalar el APK. ¿Está el dispositivo conectado y autorizado?"
fi 