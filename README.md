# Agora / Pacífico Voto Digital

## Resumen
Plataforma modular y gamificada para gestión de campañas políticas digitales, con frontend en React/Vite, backend en Python (Flask) y Node/Express. Incluye roles diferenciados, automatización, integración con mapas y experiencia de usuario tipo videojuego.

## Arquitectura
- **Frontend:** React + Vite (src/)
- **Backend Python:** Flask (agora_mobile/)
- **Backend Node:** Express (agora-agents/)
- **Base de datos y datos:** data/
- **Automatización:** Integración con n8n

## Checklist de funcionalidades
- [x] Autenticación y roles (master, candidato, líder, votante, publicidad, desarrollador)
- [x] Paneles y herramientas específicas por rol
- [x] Interfaz moderna, responsiva y gamificada
- [x] Paleta de colores dinámica (azul, blanco, dorado)
- [x] Barra de navegación móvil
- [x] Google Maps y marcadores por rol
- [x] Automatización y workflows (n8n)
- [x] Experiencia gamificada (logros, progresión, animaciones)
- [x] Testing y debugging
- [x] Documentación técnica

## Instrucciones de despliegue local
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd pacifico-voto-digital-main
   ```
2. Instala dependencias:
   ```bash
   npm install
   cd agora-agents && npm install
   cd ../agora_mobile && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
   ```
3. Levanta los servicios:
   - Frontend: `npm run dev`
   - Backend Node: `cd agora-agents && node index.js`
   - Backend Flask: `cd agora_mobile && source venv/bin/activate && python api_server.py`
4. Accede a [http://localhost:8080](http://localhost:8080) y prueba los paneles.

## Instrucciones de despliegue en VPS Ubuntu
1. Acceso SSH y actualización:
   ```bash
   ssh usuario@IP_DEL_VPS
   sudo apt update && sudo apt upgrade -y
   sudo apt install git python3 python3-venv python3-pip nodejs npm nginx ufw -y
   sudo npm install -g pm2
   ```
2. Clona el repositorio y repite los pasos de instalación.
3. Configura variables de entorno en archivos `.env`.
4. Usa PM2 para mantener los servicios activos:
   ```bash
   pm2 start index.js --name agora-agents
   pm2 start api_server.py --interpreter python3 --name agora-mobile
   ```
5. Configura Nginx para servir el frontend y hacer proxy a los backends.
6. Instala SSL con Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx
   ```
7. Configura el firewall:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

## Recomendaciones de seguridad
- Usa HTTPS siempre
- Mantén las variables de entorno fuera del repositorio
- Actualiza dependencias y sistema regularmente
- Usa usuarios no root para los servicios
- Realiza backups periódicos
- Monitorea logs y accesos

## Contacto y soporte
Para dudas o soporte, contacta al equipo de desarrollo.
