#!/bin/bash
# Instala el último APK generado en un dispositivo Android conectado por USB

APK_PATH=$(ls -t ../bin/*.apk | head -n 1)
if [ ! -f "$APK_PATH" ]; then
  echo "No se encontró un APK en ../bin/"
  exit 1
fi

echo "Verificando dispositivos conectados..."
adb devices

echo "Instalando $APK_PATH en el dispositivo..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
  echo "¡APK instalado correctamente en el dispositivo!"
else
  echo "Error al instalar el APK. ¿Está el dispositivo conectado y autorizado?"
fi 