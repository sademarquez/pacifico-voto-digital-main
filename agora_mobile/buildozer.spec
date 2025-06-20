[app]

# Nombre de la aplicación
title = Mi Campaña 2025

# Paquete de la aplicación
package.name = micampana
package.domain = com.micampana

# Versión de la aplicación
version = 1.0.0

# Requisitos de la aplicación (corrigiendo versiones y agregando dependencias comunes de Kivy)
requirements = python3,kivy==2.2.1,kivymd==1.1.1,requests,python-jose,bcrypt,sqlalchemy,aiohttp,python-dotenv,pillow,openai==1.6.1,anthropic,langchain,langchain-openai

# Archivos fuente a incluir (agregando ttf, otf, md, csv, y asegurando kv)
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,json,txt,db,ttf,otf,md,csv

# Archivos a excluir
source.exclude_dirs = tests, bin, venv
source.exclude_patterns = license,images/*.jpg

# Permisos de Android
android.permissions = INTERNET,ACCESS_NETWORK_STATE,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE

# SDK de Android
android.api = 33
android.minapi = 21
android.ndk = 25b
android.gradle_dependencies = org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.50

# Configuración de la aplicación Android
android.presplash_color = #FFFFFF
android.presplash_lottie = assets/splash.json
android.icon.filename = %(source.dir)s/assets/icon.png
android.allow_backup = True

# Servicios y actividades adicionales
services = N8NService:services/n8n_service.py

# Configuración de iOS (para futura implementación)
ios.kivy_ios_url = https://github.com/kivy/kivy-ios
ios.kivy_ios_branch = master
ios.ios_deploy_url = https://github.com/phonegap/ios-deploy
ios.ios_deploy_branch = 1.10.0

# Configuración de compilación
buildozer.warn_on_root = 0

# Configuración de debug
log_level = 2

# Configuración de pip_options
pip_options = --break-system-packages 