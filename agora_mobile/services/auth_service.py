import os
import json
from supabase import create_client, Client
from typing import Optional, Dict, Any

class AuthService:
    def __init__(self):
        """Inicializa el servicio de autenticación con Supabase y restaura sesión si existe."""
        url: Optional[str] = os.environ.get("SUPABASE_URL")
        key: Optional[str] = os.environ.get("SUPABASE_KEY")
        self.session_file = os.path.join(os.path.dirname(__file__), '../data/session.json')
        
        if not url or not key:
            raise ValueError("Las credenciales de Supabase (URL y KEY) no están configuradas.")
            
        self.supabase: Client = create_client(url, key)
        print("Servicio de Autenticación (Supabase) inicializado.")
        self._restore_session()

    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Realiza el proceso de login con Supabase."""
        try:
            res = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })
            # Guardar sesión localmente
            self._save_session(res.session)
            return {
                'success': True,
                'user': res.user,
                'session': res.session
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def register(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Registra un nuevo usuario en Supabase."""
        try:
            email = user_data.get('email')
            password = user_data.get('password')
            
            if not email or not password:
                return {'success': False, 'error': 'Email y contraseña son requeridos.'}

            # --- INICIO: Depuración ---
            signup_payload = {
                "email": email,
                "password": password
                # Temporalmente deshabilitamos los metadatos para aislar el problema.
                # "options": {
                #     "data": {
                #         'full_name': user_data.get('full_name', ''),
                #         'role': user_data.get('role', 'votante'),
                #     }
                # }
            }
            print("--- AUTH SERVICE: Enviando este payload a Supabase ---")
            print(signup_payload)
            print("----------------------------------------------------")
            
            res = self.supabase.auth.sign_up(signup_payload)
            # --- FIN: Depuración ---

            if res.user:
                # Si el registro es exitoso, actualizamos los metadatos por separado
                print("Registro inicial exitoso, actualizando metadatos...")
                try:
                    self.supabase.auth.update_user({
                        "data": {
                            'full_name': user_data.get('full_name', ''),
                            'role': user_data.get('role', 'votante'),
                        }
                    })
                    print("Metadatos actualizados correctamente.")
                except Exception as update_e:
                    print(f"Error al actualizar metadatos: {update_e}")
                    # Devolvemos éxito en el registro aunque fallen los metadatos,
                    # pero con una advertencia.
                    return {'success': True, 'message': 'Usuario registrado, pero no se pudo guardar el rol/nombre.'}

                # Guardar sesión localmente si la hay
                if res.session:
                    self._save_session(res.session)
                return {'success': True, 'message': 'Usuario registrado y metadatos actualizados.'}
            else:
                return {'success': False, 'error': 'No se pudo registrar al usuario.'}

        except Exception as e:
            print(f"--- AUTH SERVICE: Excepción de Supabase ---")
            print(e)
            print("-------------------------------------------")
            if 'User already registered' in str(e):
                return {'success': False, 'error': 'El correo electrónico ya está registrado.'}
            return {'success': False, 'error': str(e)}

    def logout(self) -> bool:
        """Cierra la sesión actual en Supabase y borra la sesión local."""
        try:
            self.supabase.auth.sign_out()
            if os.path.exists(self.session_file):
                os.remove(self.session_file)
            return True
        except Exception:
            return False

    def get_current_session(self):
        """Obtiene la sesión actual del usuario."""
        try:
            return self.supabase.auth.get_session()
        except Exception:
            return None

    def get_current_user(self):
        """Obtiene la información del usuario actual."""
        try:
            session = self.get_current_session()
            if session:
                return session.user
            return None
        except Exception:
            return None

    def _save_session(self, session):
        """Guarda la sesión en un archivo local, convirtiendo datetime a string."""
        import datetime
        def convert(obj):
            if isinstance(obj, datetime.datetime):
                return obj.isoformat()
            if isinstance(obj, dict):
                return {k: convert(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [convert(i) for i in obj]
            return obj
        try:
            os.makedirs(os.path.dirname(self.session_file), exist_ok=True)
            session_dict = session.model_dump()
            session_dict = convert(session_dict)
            with open(self.session_file, 'w') as f:
                json.dump(session_dict, f)
        except Exception as e:
            print(f"No se pudo guardar la sesión: {e}")

    def _restore_session(self):
        """Restaura la sesión desde el archivo local si existe."""
        try:
            if os.path.exists(self.session_file):
                with open(self.session_file, 'r') as f:
                    session_data = json.load(f)
                if session_data:
                    self.supabase.auth.set_session(
                        session_data.get('access_token'),
                        session_data.get('refresh_token')
                    )
        except Exception as e:
            print(f"No se pudo restaurar la sesión: {e}")

    def cleanup(self):
        """Limpia recursos. En este caso, no es necesario hacer nada."""
        print("Servicio de Autenticación limpiado.")
        pass 