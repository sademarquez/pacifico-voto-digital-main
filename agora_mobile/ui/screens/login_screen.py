from kivy.uix.screenmanager import Screen
from kivymd.uix.screen import MDScreen
from services.auth_service import AuthService
from kivy.app import App

class LoginScreen(MDScreen):
    """
    Pantalla de inicio de sesión
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.auth_service = AuthService()

    def login_user(self):
        email = self.ids.email_input.text
        password = self.ids.password_input.text
        
        print(f"Intentando iniciar sesión con: {email}") # Log para depuración
        
        if not email or not password:
            print("Email o contraseña vacíos.")
            # Aquí podrías mostrar un popup de error
            return

        response = self.auth_service.login(email, password)
        
        if response.get('success'):
            print("Login exitoso!")
            user = response.get('user')
            
            # Guardar la sesión o el usuario en la app global
            app = App.get_running_app()
            if app:
                app.user = user
                app.session = response.get('session')

            # Redirigir según el rol
            user_role = user.user_metadata.get('role', 'votante') if user and user.user_metadata else 'votante'
            if user_role == 'developer':
                self.manager.current = 'dashboard_developer'
            elif user_role == 'master':
                self.manager.current = 'dashboard_master'
            else:
                self.manager.current = 'dashboard'
        else:
            error_message = response.get('error', 'Error desconocido')
            print(f"Error de login: {error_message}")
            # Aquí también podrías mostrar un popup con el error 