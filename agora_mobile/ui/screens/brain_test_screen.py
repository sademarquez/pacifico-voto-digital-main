from kivymd.uix.screen import MDScreen
from kivy.properties import ObjectProperty
import asyncio

# ESTE ARCHIVO SERÁ REEMPLAZADO COMPLETAMENTE
# La nueva versión usará un enfoque de layout más robusto desde Python
# para evitar los problemas de renderizado del KV.

from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.label import MDLabel
from kivymd.uix.textfield import MDTextField
from kivymd.uix.button import MDRaisedButton
from kivy.uix.scrollview import ScrollView

class BrainTestScreen(MDScreen):
    agora_brain = ObjectProperty(None)
    user_id = "test_user_free"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Layout principal
        layout = MDBoxLayout(orientation='vertical', padding=20, spacing=20)
        
        # Widgets
        self.status_label = MDLabel(
            text="Brain Status: Not Initialized",
            halign='center',
            size_hint_y=None,
            theme_text_color="Secondary"
        )
        self.status_label.bind(texture_size=self.status_label.setter('size'))

        self.response_label = MDLabel(
            text="Response will appear here.",
            size_hint_y=None,
        )
        self.response_label.bind(texture_size=self.response_label.setter('size'))
        
        scroll_view = ScrollView(size_hint_y=1)
        scroll_view.add_widget(self.response_label)

        input_layout = MDBoxLayout(size_hint_y=None, height=60, spacing=10)
        self.message_input = MDTextField(hint_text="Send a message", size_hint_x=0.8)
        send_button = MDRaisedButton(text="Send", on_release=self.send_to_brain)

        input_layout.add_widget(self.message_input)
        input_layout.add_widget(send_button)
        
        # Añadir widgets al layout principal
        layout.add_widget(self.status_label)
        layout.add_widget(scroll_view)
        layout.add_widget(input_layout)
        
        # Añadir layout a la pantalla
        self.add_widget(layout)

    async def initialize_brain(self):
        """Crea una instancia del cerebro para el usuario de prueba."""
        self.status_label.text = "Initializing brain..."
        result = await self.agora_brain.create_user_brain(self.user_id, "free")
        if result.get('status') == 'success':
            self.status_label.text = f"Brain Ready for user: {self.user_id} (Tier: Free)"
            self.response_label.text = result.get('welcome_message', 'Welcome!')
        else:
            self.status_label.text = "Error initializing brain."
            self.response_label.text = result.get('error', 'Unknown error.')

    def send_to_brain(self, instance):
        """Envía el texto del campo de entrada al cerebro."""
        request_text = self.message_input.text
        if not request_text:
            return

        if self.user_id in self.agora_brain.active_brains:
            self.response_label.text = "Processing..."
            asyncio.create_task(self.process_request(request_text))
        else:
            self.response_label.text = "Brain is not ready. Please wait."

    async def process_request(self, request_text):
        """Procesa la solicitud y muestra la respuesta."""
        response = await self.agora_brain.process_request(self.user_id, request_text)
        if response.get('status') == 'success':
            self.response_label.text = response.get('response', 'No response text.')
        else:
            self.response_label.text = f"Error: {response.get('error', 'Unknown error.')}"
        self.message_input.text = "" 