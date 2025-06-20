#!/bin/bash
# Script de instalación automática de Buildozer y dependencias para WSL Ubuntu

set -e

echo "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

echo "Instalando dependencias básicas..."
sudo apt install -y python3-pip python3-setuptools git python3 python3-venv zip unzip openjdk-8-jdk adb

echo "Instalando Cython y Buildozer..."
pip3 install --user cython buildozer

echo "Instalación completada."
echo "Recuerda cerrar y abrir la terminal para que el PATH de pip --user se aplique."
echo "Luego, navega a la carpeta de tu proyecto y ejecuta:"
echo "    buildozer -v android debug" 