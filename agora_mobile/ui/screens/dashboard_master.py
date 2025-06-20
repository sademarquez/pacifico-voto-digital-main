from kivymd.uix.screen import MDScreen
from typing import Optional
from core.agora_brain import AgoraBrain
import threading
from kivy.clock import Clock
from kivymd.uix.dialog import MDDialog
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDFlatButton, MDRaisedButton
from kivymd.uix.textfield import MDTextField
from kivy.app import App

class CreateUserContent(MDBoxLayout):
    """Clase para el contenido del diálogo de creación de usuario."""
    def __init__(self, role, **kwargs):
        super().__init__(**kwargs)
        self.orientation = "vertical"
        self.spacing = "12dp"
        self.size_hint_y = None
        self.height = "120dp"
        self.email_field = MDTextField(hint_text=f"Email del {role.capitalize()}")
        self.name_field = MDTextField(hint_text=f"Nombre del {role.capitalize()}")
        self.add_widget(self.email_field)
        self.add_widget(self.name_field)

class DashboardMasterScreen(MDScreen):
    """
    Dashboard para el rol de Master.
    Permite gestionar candidatos, líderes y ver estadísticas generales.
    """
    agora_brain: Optional[AgoraBrain] = None
    user_id: Optional[str] = None # Se establecerá en el login
    dialog = None

    def on_enter(self, *args):
        """Se ejecuta al entrar a la pantalla."""
        app = App.get_running_app()
        if app and hasattr(app, 'user') and app.user:
            self.user_id = app.user.id
        else:
            self.user_id = "master_user_fallback"

        print(f"Acceso al Dashboard de Master para el usuario {self.user_id}.")
        if self.agora_brain and self.user_id and not self.agora_brain.active_brains.get(self.user_id):
            print("Dashboard Master: Inicializando cerebro...")
            threading.Thread(target=self.initialize_user_brain, daemon=True).start()

    def initialize_user_brain(self):
        """Crea la instancia del cerebro para el master."""
        if not self.agora_brain or not self.user_id: 
            return
        result = self.agora_brain.create_user_brain(self.user_id, tier="master")
        if result.get('status') == 'success':
            Clock.schedule_once(lambda dt: self.update_result_label(result.get('welcome_message', 'Bienvenido Master!')))
        else:
            Clock.schedule_once(lambda dt: self.update_result_label(f"Error: {result.get('error')}"))

    def show_create_user_dialog(self, role: str):
        """Muestra un diálogo genérico para crear un usuario (candidato o líder)."""
        if self.dialog:
            self.dialog.dismiss()

        self.dialog_content = CreateUserContent(role=role)
        self.dialog = MDDialog(
            title=f"Crear Cuenta de {role.capitalize()}",
            type="custom",
            content_cls=self.dialog_content,
            buttons=[
                MDFlatButton(text="CANCELAR", on_release=self.close_dialog),
                MDRaisedButton(text="CREAR", on_release=lambda x: self.process_user_creation(role)),
            ],
        )
        self.dialog.open()

    def close_dialog(self, *args):
        if self.dialog:
            self.dialog.dismiss()

    def process_user_creation(self, role: str):
        """Procesa la creación de la cuenta desde el diálogo."""
        email = self.dialog_content.email_field.text
        name = self.dialog_content.name_field.text
        self.close_dialog()

        if not email or not name:
            self.update_result_label(f"Error: El email y el nombre para el {role} no pueden estar vacíos.")
            return

        prompt = f"crea una cuenta de {role} para el usuario '{name}' con email '{email}'"
        self.ids.master_result_label.text = f"Enviando solicitud para crear cuenta de {role}..."
        self.ids.master_spinner.active = True
        threading.Thread(target=self.get_brain_response, args=(prompt,), daemon=True).start()

    def get_brain_response(self, text: str):
        """Obtiene la respuesta del cerebro y actualiza la UI."""
        if not self.agora_brain or not self.user_id: return
        
        if not self.agora_brain.active_brains.get(self.user_id):
            Clock.schedule_once(lambda dt: self.update_result_label("El cerebro del master no está listo."))
            return
            
        response_data = self.agora_brain.process_request(self.user_id, text)
        
        if response_data.get('status') == 'success':
            ai_response = response_data.get('response', 'No pude procesar eso.')
        else:
            ai_response = f"Error: {response_data.get('error', 'Error desconocido')}"
        
        Clock.schedule_once(lambda dt: self.update_result_label(ai_response))

    def update_result_label(self, text: str):
        """Actualiza la etiqueta de resultado en el dashboard master."""
        self.ids.master_spinner.active = False
        self.ids.master_result_label.text = text 