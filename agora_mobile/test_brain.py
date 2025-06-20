import os
from dotenv import load_dotenv

# Asegúrate de que los imports relativos funcionen correctamente
# Añadimos el directorio padre al sys.path
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- Añadimos imports para la aleatoriedad ---
import random
import string

from agora_mobile.core.agora_brain import AgoraBrain
from agora_mobile.services.auth_service import AuthService

def generate_random_string(length=8):
    """Genera una cadena alfanumérica aleatoria."""
    letters_and_digits = string.ascii_lowercase + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

def run_developer_test():
    """
    Ejecuta una prueba completa del flujo de desarrollador:
    1. Carga las variables de entorno.
    2. Inicializa los servicios.
    3. Crea un cerebro de desarrollador.
    4. Prueba la herramienta para crear una cuenta de tipo 'master'.
    """
    # 1. Cargar variables de entorno desde el archivo .env en la raíz del proyecto.
    load_dotenv()

    try:
        # 2. Inicializar servicios
        print("\n... Inicializando AuthService...")
        auth_service = AuthService()
        print("OK: AuthService inicializado.")
        
        print("\n... Inicializando AgoraBrain...")
        agora_brain = AgoraBrain(auth_service=auth_service)
        agora_brain.initialize()
        print("OK: AgoraBrain inicializado.")

        # 3. Crear cerebro de desarrollador
        user_id = "dev_test_user_001"
        print(f"\n... Creando cerebro para el usuario '{user_id}' con tier 'developer'...")
        brain_creation_result = agora_brain.create_user_brain(user_id, tier="developer")
        
        if brain_creation_result.get('status') != 'success':
            print(f"ERROR: No se pudo crear el cerebro: {brain_creation_result.get('error')}")
            return
            
        print(f"OK: Cerebro creado. ID: {brain_creation_result['brain_id']}")
        print(f"Mensaje de Bienvenida: {brain_creation_result['welcome_message']}")

        # 4. Probar la herramienta de creación de cuenta master
        random_part = generate_random_string()
        test_email = f"master.test.{random_part}@example.com"
        test_name = "Master Test"
        test_prompt = f"Necesito que me ayudes. Por favor, crea una cuenta de master para el usuario '{test_name}' con email '{test_email}'"
        
        print(f"\n... Enviando prompt de prueba al cerebro:\n'{test_prompt}'")
        
        response_data = agora_brain.process_request(user_id, test_prompt)
        
        print("\n--- RESPUESTA DEL CEREBRO ---")
        if response_data.get('status') == 'success':
            print(f"Resultado: {response_data.get('response')}")
        else:
            print(f"Error: {response_data.get('error')}")
        print("-----------------------------\n")

    except Exception as e:
        print(f"\n--- OCURRIÓ UNA EXCEPCIÓN INESPERADA ---")
        print(f"Error: {e}")
        print("------------------------------------------\n")

if __name__ == "__main__":
    run_developer_test() 