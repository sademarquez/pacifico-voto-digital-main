import threading
from typing import Optional
from kivy.clock import Clock
from kivymd.uix.screen import MDScreen
from kivymd.uix.list import TwoLineIconListItem, IconLeftWidget
from services.auth_service import AuthService
from core.agora_brain import AgoraBrain

class DashboardScreen(MDScreen):
    """
    Pantalla principal (Dashboard) que gestiona la interacción con AgoraBrain.
    """
    agora_brain: Optional[AgoraBrain] = None
    user_id = "test_user_01"  # Usaremos un ID de usuario fijo por ahora

    def on_enter(self, *args):
        """
        Se llama una vez que la pantalla es visible.
        Inicializa el cerebro del usuario si no se ha hecho antes.
        """
        if self.agora_brain and not self.agora_brain.active_brains.get(self.user_id):
            print("Dashboard: Inicializando cerebro para el usuario en un hilo...")
            threading.Thread(target=self.initialize_user_brain, daemon=True).start()

    def initialize_user_brain(self):
        """
        Crea la instancia específica del cerebro para nuestro usuario.
        Esta función se ejecuta en un hilo separado.
        """
        if not self.agora_brain:
            return
        result = self.agora_brain.create_user_brain(self.user_id, tier="free")
        
        if result.get('status') == 'success':
            welcome_message = result.get('welcome_message', 'Bienvenido!')
            Clock.schedule_once(lambda dt: self.add_message(welcome_message, "ai"))
        else:
            error_msg = result.get('error', 'Error desconocido')
            Clock.schedule_once(lambda dt: self.add_message(f"Error del cerebro: {error_msg}", "ai"))

    def send_message(self):
        """
        Captura el texto del usuario, lo muestra en el chat
        y lo envía al cerebro en un hilo separado.
        """
        user_input = self.ids.message_input.text
        if not user_input.strip():
            return

        self.add_message(user_input, "user")
        self.ids.message_input.text = ""

        threading.Thread(target=self.get_brain_response, args=(user_input,), daemon=True).start()

    def get_brain_response(self, text):
        """
        Obtiene la respuesta del cerebro y programa la actualización de la UI.
        Esta función se ejecuta en un hilo separado.
        """
        if not self.agora_brain:
            Clock.schedule_once(lambda dt: self.add_message("Error: Cerebro no disponible.", "ai"))
            return

        response_data = self.agora_brain.process_request(self.user_id, text)
        
        if response_data.get('status') == 'success':
            ai_response = response_data.get('response', 'No pude procesar eso.')
        else:
            ai_response = f"Error: {response_data.get('error', 'Error desconocido')}"
        
        Clock.schedule_once(lambda dt: self.add_message(ai_response, "ai"))

    def add_message(self, text, author):
        """
        Añade un widget de mensaje a la lista del chat.
        """
        if author == "user":
            list_item = TwoLineIconListItem(text="Tú", secondary_text=text)
            list_item.add_widget(IconLeftWidget(icon="account"))
        else:  # author == "ai"
            list_item = TwoLineIconListItem(text="Agora", secondary_text=text)
            list_item.add_widget(IconLeftWidget(icon="robot"))
        
        self.ids.chat_list.add_widget(list_item)
        # Para hacer scroll hacia el último mensaje
        if hasattr(self.ids, 'chat_scroll'):
            self.ids.chat_scroll.scroll_y = 0

    def logout(self):
        """Cierra la sesión y regresa al login."""
        auth_service = AuthService()
        auth_service.logout()
        self.manager.current = 'login'

    def get_role_display(self):
        """Devuelve el nombre del rol según la pantalla actual."""
        role_map = {
            'dashboard_candidato': 'Candidato',
            'dashboard_lider': 'Líder',
            'dashboard_votante': 'Votante',
            'dashboard_publicidad': 'Publicidad',
            'dashboard': 'Usuario',
        }
        return role_map.get(self.name, 'Usuario') 