#!/bin/bash
# Script para instalar automáticamente el APK generado en el emulador Android

APK_PATH="../bin/$(ls ../bin | grep -E '\.apk$' | sort | tail -n 1)"

if [ ! -f "$APK_PATH" ]; then
  echo "No se encontró un APK en $APK_PATH"
  exit 1
fi

echo "Instalando $APK_PATH en el emulador..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
  echo "¡APK instalado correctamente en el emulador!"
else
  echo "Error al instalar el APK. ¿Está el emulador corriendo y adb en el PATH?"
fi 