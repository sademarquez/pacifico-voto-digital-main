from kivymd.uix.screen import MDScreen
from kivy.properties import StringProperty

class TerminalSimuladaScreen(MDScreen):
    output_text = StringProperty("")

    def ejecutar_comando(self):
        comando = self.ids.comando_input.text
        # Simulación de respuesta
        self.output_text += f"$ {comando}\nSimulación de salida para: {comando}\n"
        self.ids.comando_input.text = ""

    def volver_login(self):
        self.manager.current = 'login' 