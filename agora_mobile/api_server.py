import os
import sys
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Añadir la ruta del proyecto al sys.path para asegurar que los módulos se encuentren
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agora_mobile.core.agora_brain import AgoraBrain
from agora_mobile.services.auth_service import AuthService

# --- Configuración Inicial ---
load_dotenv()

app = Flask(__name__)
CORS(app) # Esto permite peticiones desde cualquier origen

# --- Inicialización Singleton del Cerebro y Servicios ---
# Se crea una única instancia para toda la aplicación
print("... Inicializando servicios y cerebro de Agora para la API...")
try:
    auth_service_instance = AuthService()
    agora_brain = AgoraBrain(auth_service=auth_service_instance)
    agora_brain.initialize()
    print("OK: Cerebro de Agora listo para recibir peticiones.")
except Exception as e:
    agora_brain = None
    print(f"FATAL: No se pudo inicializar el cerebro de Agora: {e}")

# --- Rutas de la API ---
@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Endpoint principal para interactuar con el cerebro Agora.
    Espera un JSON con 'user_id' y 'prompt'.
    """
    if not agora_brain:
        return jsonify({'status': 'error', 'error': 'El cerebro no está disponible.'}), 503

    data = request.get_json()
    if not data or 'prompt' not in data:
        return jsonify({'status': 'error', 'error': 'Falta el campo "prompt" en la solicitud.'}), 400

    # Por ahora, usamos un user_id fijo. En una app real, vendría de la sesión del usuario.
    user_id = data.get('user_id', 'default_user')
    prompt = data['prompt']

    print(f"\n[API] Petición recibida para user_id '{user_id}': '{prompt}'")

    # Crear el cerebro para el usuario si no existe
    if user_id not in agora_brain.active_brains:
        print(f"[API] Cerebro no encontrado para '{user_id}'. Creando uno nuevo con tier 'developer'...")
        # Usamos 'developer' para tener todas las herramientas disponibles para la demo.
        agora_brain.create_user_brain(user_id, tier="developer")

    # Procesar la petición
    response = agora_brain.process_request(user_id, prompt)
    
    # --- Lógica de Redirección ---
    # Si la respuesta indica éxito en la creación, añadimos una clave de redirección.
    if response.get('status') == 'success':
        response_text = response.get('response', '')
        if response_text.startswith("Cuenta de"):
            # Extraemos el rol del mensaje, ej: "Cuenta de master creada..." -> "master"
            role_match = re.search(r"Cuenta de (\w+)", response_text)
            if role_match:
                role = role_match.group(1).lower()
                redirect_paths = {
                    "master": "/configuracion",
                    "candidato": "/candidato",
                    "lider": "/liderazgo",
                    "votante": "/dashboard",
                    "publicidad": "/reporte-publicidad"
                }
                # Añade la nueva clave 'redirect' al diccionario de respuesta
                if role in redirect_paths:
                    response['redirect'] = redirect_paths[role]
                    print(f"[API] Añadiendo redirección para rol '{role}' a '{response['redirect']}'")

    print(f"[API] Respuesta final enviada: {response}")

    return jsonify(response)

@app.route('/api/theme', methods=['GET'])
def get_theme():
    """
    Endpoint para obtener la paleta de colores personalizada.
    """
    try:
        if os.path.exists('data/theme.json'):
            with open('data/theme.json', 'r') as f:
                theme_data = json.load(f)
            return jsonify(theme_data)
        else:
            # Devuelve un tema por defecto si no se ha configurado ninguno
            default_theme = {"primary": "#1E3A8A", "accent": "#FBBF24"}
            return jsonify(default_theme)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/map_data', methods=['GET'])
def get_map_data():
    """
    Endpoint para obtener los marcadores del mapa según el rol.
    El rol se pasa como un argumento en la URL, ej: /api/map_data?role=candidato
    """
    if not agora_brain:
        return jsonify({'status': 'error', 'error': 'El cerebro no está disponible.'}), 503

    role = request.args.get('role', 'default') # 'default' si no se especifica rol
    
    # Usamos directamente la herramienta del cerebro para mantener la lógica centralizada
    # (El 'input' para esta herramienta es solo el string del rol)
    markers_json_string = agora_brain.get_map_markers_for_role_tool(role)
    
    # La herramienta devuelve un string JSON, lo convertimos a un objeto Python y lo devolvemos
    try:
        markers = json.loads(markers_json_string)
        if "error" in markers:
            return jsonify(markers), 500
        return jsonify(markers)
    except json.JSONDecodeError:
        return jsonify({"error": "La respuesta del cerebro no era un JSON válido."}), 500

# --- Arranque del Servidor ---
if __name__ == '__main__':
    # Usamos el puerto 5001 para evitar conflictos comunes (como el 5000)
    app.run(host='0.0.0.0', port=5001, debug=True) 