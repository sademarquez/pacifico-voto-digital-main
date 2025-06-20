from kivymd.uix.screen import MDScreen
from services.auth_service import AuthService

class RegisterScreen(MDScreen):
    """
    Pantalla de registro
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.auth_service = AuthService()

    def register_user(self):
        name = self.ids.name_input.text.strip()
        email = self.ids.email_input_register.text.strip()
        password = self.ids.password_input_register.text
        role = self.ids.role_input.text.lower().strip() or 'votante'
        
        if not name or not email or not password:
            print("Error: Nombre, email y contraseña no pueden estar vacíos.")
            # Aquí podrías mostrar un popup de error
            return

        user_data = {
            "full_name": name,
            "email": email,
            "password": password,
            "role": role
        }
        
        response = self.auth_service.register(user_data)

        if response.get('success'):
            print("Registro exitoso! Por favor, revisa tu email para confirmar.")
            # Podríamos cambiar a la pantalla de login automáticamente
            self.manager.current = 'login'
        else:
            error_message = response.get('error', 'Error desconocido')
            print(f"Error de registro: {error_message}")
            # Mostrar popup con el error 