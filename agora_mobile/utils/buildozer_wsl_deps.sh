#!/bin/bash
# Script integral para compilar APK Kivy/Buildozer en WSL/Ubuntu de forma segura
# Ejecutar: bash buildozer_wsl_deps.sh

set -e

# 1. Detener procesos previos

echo "Deteniendo procesos previos de buildozer y adb..."
pkill -f buildozer || true
pkill -f adb || true
sleep 2

echo "Procesos detenidos."

# 2. Limpiar builds previos
cd "$(dirname "$0")/.."
echo "Limpiando directorios de compilación previos (.buildozer, build, bin)..."
rm -rf .buildozer build bin

echo "Directorio limpio."

# 3. Crear y activar entorno virtual seguro
if [ ! -d "venv" ]; then
  echo "Creando entorno virtual Python..."
  python3 -m venv venv
fi
source venv/bin/activate
echo "Entorno virtual activado."

# 4. Instalar dependencias del sistema

echo "Actualizando repositorios..."
sudo apt update

echo "Instalando herramientas de compilación y librerías necesarias..."
sudo apt install -y \
  build-essential \
  python3-dev \
  python3-venv \
  python3-pip \
  git \
  zip unzip \
  openjdk-17-jdk \
  libffi-dev \
  libssl-dev \
  libbz2-dev \
  libsqlite3-dev \
  liblzma-dev \
  zlib1g-dev \
  tk-dev \
  cmake \
  autoconf \
  automake \
  libtool \
  pkg-config

echo "Dependencias del sistema instaladas."

# 5. Instalar dependencias Python en el entorno virtual

echo "Instalando/actualizando pip, setuptools y wheel en el entorno virtual..."
pip install --upgrade pip setuptools wheel

echo "Instalando buildozer y kivy en el entorno virtual..."
pip install --upgrade buildozer kivy

echo "Dependencias Python instaladas."

# 6. Compilar APK

echo "Comenzando compilación: buildozer android debug"
buildozer android debug

# 7. Recomendaciones de seguridad y vinculación al VPS

echo "\n================ SEGURIDAD Y VINCULACIÓN VPS ================\n"
echo "1. Nunca expongas el APK generado públicamente sin firmar y proteger."
echo "2. Para vincular la app al backend en tu VPS, asegúrate de:"
echo "   - Configurar la URL del backend en los archivos de configuración de la app (por ejemplo, .env, config.py, etc.)."
echo "   - Usar HTTPS y certificados válidos en el VPS."
echo "   - Limitar el acceso por IP/firewall en el VPS."
echo "   - Mantener las claves y tokens fuera del código fuente."
echo "3. Para producción, firma el APK con tu clave privada."
echo "4. Si necesitas ayuda para configurar la comunicación segura app <-> VPS, consulta la documentación o pide soporte."
echo "\n============================================================\n" 