from dotenv import load_dotenv
load_dotenv()

import os
import asyncio
from dotenv import load_dotenv
from kivy.lang import Builder
from kivymd.app import MDApp
from kivy.core.window import Window
from kivy.uix.screenmanager import ScreenManager

from core.agora_brain import AgoraBrain
from ui.screens.login_screen import LoginScreen
from ui.screens.register_screen import RegisterScreen
from ui.screens.dashboard_screen import DashboardScreen
from ui.screens.dashboard_developer import DashboardDeveloperScreen
from ui.screens.dashboard_master import DashboardMasterScreen
from services.auth_service import AuthService
from ui.screens.terminal_simulada import TerminalSimuladaScreen

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

class AgoraMobileApp(MDApp):
    def build(self):
        Window.size = (400, 700)
        self.theme_cls.theme_style = "Light"
        self.theme_cls.primary_palette = "Blue"

        self.auth_service = AuthService()
        self.agora_brain = AgoraBrain(auth_service=self.auth_service)

        # Cargar archivos KV
        Builder.load_file('ui/screens/login.kv')
        Builder.load_file('ui/screens/register.kv')
        Builder.load_file('ui/screens/dashboard.kv')
        Builder.load_file('ui/screens/dashboard_developer.kv')
        Builder.load_file('ui/screens/dashboard_master.kv')
        Builder.load_file('ui/screens/terminal_simulada.kv')

        # Configurar Screen Manager
        self.sm = ScreenManager()
        self.sm.add_widget(LoginScreen(name='login'))
        self.sm.add_widget(RegisterScreen(name='register'))
        
        dashboard_screen = DashboardScreen(name='dashboard')
        dashboard_screen.agora_brain = self.agora_brain
        self.sm.add_widget(dashboard_screen)

        dev_dashboard_screen = DashboardDeveloperScreen(name='dashboard_developer')
        dev_dashboard_screen.agora_brain = self.agora_brain
        self.sm.add_widget(dev_dashboard_screen)

        master_dashboard_screen = DashboardMasterScreen(name='dashboard_master')
        master_dashboard_screen.agora_brain = self.agora_brain
        self.sm.add_widget(master_dashboard_screen)

        # Pantallas para otros roles (usando DashboardScreen como base)
        dashboard_candidato = DashboardScreen(name='dashboard_candidato')
        dashboard_candidato.agora_brain = self.agora_brain
        self.sm.add_widget(dashboard_candidato)

        dashboard_lider = DashboardScreen(name='dashboard_lider')
        dashboard_lider.agora_brain = self.agora_brain
        self.sm.add_widget(dashboard_lider)

        dashboard_votante = DashboardScreen(name='dashboard_votante')
        dashboard_votante.agora_brain = self.agora_brain
        self.sm.add_widget(dashboard_votante)

        dashboard_publicidad = DashboardScreen(name='dashboard_publicidad')
        dashboard_publicidad.agora_brain = self.agora_brain
        self.sm.add_widget(dashboard_publicidad)
        
        # Registrar pantalla de terminal simulada
        self.sm.add_widget(TerminalSimuladaScreen(name='terminal_simulada'))
        
        # Si hay sesión válida, ir directo al dashboard correcto
        current_user = self.auth_service.get_current_user()
        if self.auth_service.get_current_session() and current_user:
            user_role = current_user.user_metadata.get('role', 'votante')
            if user_role == 'developer':
                self.sm.current = 'dashboard_developer'
            elif user_role == 'master':
                self.sm.current = 'dashboard_master'
            else:
                self.sm.current = 'dashboard'
        else:
            self.sm.current = 'login'
        
        return self.sm

    def on_start(self):
        """Inicializa los servicios necesarios."""
        self.agora_brain.initialize()

    def on_stop(self):
        """Limpia los recursos al cerrar."""
        self.agora_brain.cleanup()

    def on_pause(self):
        return True

    def on_resume(self):
        pass

    def login(self):
        """Función de login provisional."""
        login_screen = self.sm.get_screen('login')
        email = login_screen.ids.email_input.text
        password = login_screen.ids.password_input.text
        print(f"Intento de login con Email: {email}, Contraseña: {password}")
        
        # Lógica de autenticación (provisional)
        # Aquí iría la llamada al servicio de autenticación
        
        # Si la autenticación es exitosa:
        self.sm.current = 'dashboard'

    def register(self):
        """Función de registro provisional."""
        register_screen = self.sm.get_screen('register')
        name = register_screen.ids.name_input.text
        email = register_screen.ids.email_input_register.text
        password = register_screen.ids.password_input_register.text
        print(f"Intento de registro con Nombre: {name}, Email: {email}, Contraseña: {password}")
        
        # Lógica de registro (provisional)
        # Aquí iría la llamada al servicio de autenticación para crear el usuario
        
        # Si el registro es exitoso, podríamos llevar al usuario al login
        self.sm.current = 'login'


if __name__ == '__main__':
    try:
        AgoraMobileApp().run()
    except Exception as e:
        print(f"Ocurrió un error al iniciar la aplicación: {e}")
        import traceback
        traceback.print_exc()
        input("Presiona Enter para salir...") 