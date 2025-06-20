from kivymd.uix.screen import MDScreen
import threading
from kivy.clock import Clock
from kivymd.uix.dialog import MDDialog
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDFlatButton, MDRaisedButton
from kivymd.uix.textfield import MDTextField
from core.agora_brain import AgoraBrain
from typing import Optional

class Content(MDBoxLayout):
    """Clase para el contenido del diálogo de creación."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = "vertical"
        self.spacing = "12dp"
        self.size_hint_y = None
        self.height = "120dp"
        self.email_field = MDTextField(hint_text="Email del Master")
        self.name_field = MDTextField(hint_text="Nombre del Master")
        self.add_widget(self.email_field)
        self.add_widget(self.name_field)

class DashboardDeveloperScreen(MDScreen):
    """
    Dashboard para el rol de Desarrollador.
    Permite gestionar cuentas master, APIs, y auditar el sistema.
    """
    agora_brain: Optional[AgoraBrain] = None
    user_id = "developer_user_01"
    dialog = None

    def on_enter(self, *args):
        """Se ejecuta al entrar a la pantalla. Inicializa el cerebro si es necesario."""
        print("Acceso al Dashboard de Desarrollador.")
        if self.agora_brain and not self.agora_brain.active_brains.get(self.user_id):
            print("Dashboard Dev: Inicializando cerebro para el desarrollador...")
            threading.Thread(target=self.initialize_user_brain, daemon=True).start()

    def initialize_user_brain(self):
        """Crea la instancia del cerebro para el desarrollador en un hilo."""
        if not self.agora_brain:
            Clock.schedule_once(lambda dt: self.update_audit_result("Error: Cerebro no disponible."))
            return
        result = self.agora_brain.create_user_brain(self.user_id, tier="developer")
        
        if result.get('status') == 'success':
            welcome_message = result.get('welcome_message', 'Bienvenido Dev!')
            Clock.schedule_once(lambda dt: self.update_audit_result(welcome_message))
        else:
            error_msg = result.get('error', 'Error desconocido')
            Clock.schedule_once(lambda dt: self.update_audit_result(f"Error del cerebro: {error_msg}"))

    def create_master_account(self):
        """Muestra un diálogo para crear una cuenta master."""
        if not self.dialog:
            self.dialog_content = Content()
            self.dialog = MDDialog(
                title="Crear Cuenta Master",
                type="custom",
                content_cls=self.dialog_content,
                buttons=[
                    MDFlatButton(text="CANCELAR", on_release=self.close_dialog),
                    MDRaisedButton(text="CREAR", on_release=self.process_master_account_creation),
                ],
            )
        self.dialog.open()

    def close_dialog(self, *args):
        """Cierra el diálogo."""
        if self.dialog:
            self.dialog.dismiss()

    def process_master_account_creation(self, *args):
        """Procesa la creación de la cuenta desde el diálogo."""
        email = self.dialog_content.email_field.text
        name = self.dialog_content.name_field.text
        self.close_dialog()
        
        if not email or not name:
            self.update_audit_result("Error: El email y el nombre no pueden estar vacíos.")
            return

        prompt = f"crea una cuenta master para el usuario '{name}' con email '{email}'"
        self.ids.audit_result_label.text = "Enviando solicitud para crear cuenta master..."
        self.ids.audit_spinner.active = True
        threading.Thread(target=self.get_brain_response, args=(prompt,), daemon=True).start()

    def manage_api_keys(self):
        print("Función para gestionar API Keys.")
        self.update_audit_result("Esta función aún no está implementada.")

    def run_system_audit(self):
        """Ejecuta la auditoría del sistema usando el cerebro en un hilo."""
        print("Función para ejecutar auditoría del sistema.")
        prompt = "run system audit"
        self.ids.audit_result_label.text = "Ejecutando auditoría..."
        self.ids.audit_spinner.active = True
        threading.Thread(target=self.get_brain_response, args=(prompt,), daemon=True).start()

    def get_brain_response(self, text):
        """Obtiene la respuesta del cerebro y programa la actualización de la UI."""
        if not self.agora_brain:
            Clock.schedule_once(lambda dt: self.update_audit_result("Error: Cerebro no disponible."))
            return

        if not self.agora_brain.active_brains.get(self.user_id):
            Clock.schedule_once(lambda dt: self.update_audit_result("El cerebro del desarrollador no está listo. Intenta de nuevo."))
            return

        response_data = self.agora_brain.process_request(self.user_id, text)
        
        if response_data.get('status') == 'success':
            ai_response = response_data.get('response', 'No pude procesar eso.')
        else:
            ai_response = f"Error: {response_data.get('error', 'Error desconocido')}"
        
        Clock.schedule_once(lambda dt: self.update_audit_result(ai_response))

    def update_audit_result(self, result_text):
        """Actualiza la etiqueta de resultado en la UI."""
        self.ids.audit_spinner.active = False
        self.ids.audit_result_label.text = result_text 