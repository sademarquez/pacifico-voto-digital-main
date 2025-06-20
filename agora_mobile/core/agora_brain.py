import os
import json
import re
import secrets
import string
from datetime import datetime
from typing import Dict, List, Optional, Any
import requests
import time

from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.language_models.llms import BaseLLM
from langchain_core.outputs import LLMResult, Generation
from langchain.tools import Tool
from langchain_google_genai import ChatGoogleGenerativeAI
from services.auth_service import AuthService


class AgoraBrain:
    def __init__(self, auth_service: Optional[AuthService] = None):
        """Inicializa el cerebro Agora"""
        self.auth_service = auth_service
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        self.n8n_url = os.getenv('N8N_URL', 'http://localhost:5678')
        self.n8n_token = os.getenv('N8N_TOKEN')
        
        self.free_tier_limits = {
            'daily_requests': 100,
            'monthly_tokens': 10000,
            'max_workflows': 3,
            'real_time_monitoring': False
        }
        
        self.premium_tier_limits = {
            'daily_requests': 10000,
            'monthly_tokens': 1000000,
            'max_workflows': 50,
            'real_time_monitoring': True
        }
        
        self.developer_tier_limits = {
            'daily_requests': float('inf'), # Sin límites
            'monthly_tokens': float('inf'),
            'max_workflows': float('inf'),
            'real_time_monitoring': True
        }

        self.active_brains: Dict[str, Dict[str, Any]] = {}
        
    def initialize(self):
        """Inicializa los servicios necesarios"""
        self._load_configurations()
        print("🧠 Agora Brain inicializado")

    def create_user_brain(self, user_id: str, tier: str = "free") -> Dict:
        """Crea una instancia personalizada del cerebro para un usuario"""
        try:
            if tier == "developer":
                limits = self.developer_tier_limits
            elif tier == "premium":
                limits = self.premium_tier_limits
            else:
                limits = self.free_tier_limits
            
            memory = ConversationBufferWindowMemory(
                k=10 if tier == "free" else 50,
                return_messages=True,
                memory_key="chat_history",
                output_key="output"
            )
            
            tools = self._setup_user_tools(user_id, tier)
            
            llm = None
            if (tier == "premium" or tier == "developer"):
                if not self.google_api_key:
                    raise ValueError("Se requiere una GOOGLE_API_KEY para el tier 'premium' o 'developer'.")
                
                llm = ChatGoogleGenerativeAI(
                    model="gemini-pro",
                    temperature=0.7,
                    google_api_key=self.google_api_key,
                    convert_system_message_to_human=True
                )
            else:
                llm = self._create_simulated_llm()
            
            prompt = hub.pull("hwchase17/react-chat")
            
            agent = create_react_agent(
                llm=llm,
                tools=tools,
                prompt=prompt
            )
            
            agent_executor = AgentExecutor(
                agent=agent,
                tools=tools,
                memory=memory,
                verbose=True,
                handle_parsing_errors=True
            )
            
            brain_config = {
                'user_id': user_id,
                'tier': tier,
                'limits': limits,
                'agent': agent_executor,
                'created_at': datetime.utcnow().isoformat(),
                'last_active': datetime.utcnow().isoformat(),
                'usage_stats': {'requests_today': 0, 'tokens_used_month': 0, 'workflows_created': 0}
            }
            
            self.active_brains[user_id] = brain_config
            
            return {
                'status': 'success',
                'brain_id': user_id,
                'tier': tier,
                'limits': limits,
                'welcome_message': self._generate_welcome_message(tier)
            }
            
        except Exception as e:
            return {'status': 'error', 'error': f"{e}"}

    def _create_simulated_llm(self):
        """Crea un LLM simulado compatible con la interfaz Runnable."""

        class SimulatedLLM(BaseLLM):
            responses: dict = {
                "saludo": "¡Hola! Soy tu asistente de campaña. ¿En qué puedo ayudarte?",
                "consejo": "Para mejorar tu campaña, enfócate en la comunicación directa y usa redes sociales.",
                "sentimiento": "El análisis de sentimiento muestra una tendencia positiva.",
                "crisis": "En caso de crisis, mantén la calma y comunica de forma transparente.",
                "default": "Puedo ayudarte con análisis de sentimientos y consejos de campaña."
            }

            def _call(self, prompt: str, stop: Optional[List[str]] = None, **kwargs: Any) -> str:
                time.sleep(0.5)
                query_lower = prompt.lower()

                # Lógica mejorada para simular la selección de herramientas de creación de usuarios
                if 'crea una cuenta' in query_lower:
                    tool_name = None
                    if 'master' in query_lower:
                        tool_name = "create_master_account_tool"
                    elif 'candidato' in query_lower:
                        tool_name = "create_candidate_account_tool"
                    elif 'lider' in query_lower:
                        tool_name = "create_leader_account_tool"
                    
                    if tool_name:
                        # El formato de respuesta debe incluir "Thought:", "Action:" y "Action Input:"
                        # para que el agente ReAct pueda parsearlo correctamente.
                        action_input = prompt
                        return (
                            f"Thought: El usuario quiere crear una cuenta. "
                            f"Usaré la herramienta `{tool_name}`.\n"
                            f"Action: {tool_name}\n"
                            f"Action Input: {action_input}"
                        )

                if any(word in query_lower for word in ['hola', 'buenos', 'saludos']):
                    return self.responses["saludo"]
                elif any(word in query_lower for word in ['consejo', 'estrategia', 'campaña']):
                    return self.responses["consejo"]
                elif any(word in query_lower for word in ['sentimiento', 'análisis', 'opinión']):
                    return self.responses["sentimiento"]
                elif any(word in query_lower for word in ['crisis', 'problema', 'emergencia']):
                    return self.responses["crisis"]
                else:
                    return self.responses["default"]
            
            def _generate(self, prompts: List[str], stop: Optional[List[str]] = None, **kwargs: Any) -> LLMResult:
                """Implementación del método abstracto _generate."""
                generations = []
                for prompt in prompts:
                    text = self._call(prompt, stop=stop, **kwargs)
                    generations.append([Generation(text=text)])
                return LLMResult(generations=generations)

            @property
            def _llm_type(self) -> str:
                return "simulated"

        return SimulatedLLM()

    def process_request(self, user_id: str, request: str) -> Dict:
        try:
            if user_id not in self.active_brains:
                return {'error': 'Cerebro no inicializado para este usuario'}
            
            brain = self.active_brains[user_id]
            
            if not self._check_limits(user_id):
                return {'error': 'Límite de uso excedido.'}
            
            agent_response = brain['agent'].invoke({'input': request})
            
            response_text = agent_response.get('output', 'No se pudo obtener una respuesta.')

            self._update_usage_stats(user_id, request, response_text)
            
            return {
                'status': 'success',
                'response': response_text,
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}

    def _setup_user_tools(self, user_id: str, tier: str) -> List[Tool]:
        tools = [
            Tool(name="sentiment_analyzer", func=lambda text: "Sentimiento: neutral.", description="Analiza el sentimiento de textos políticos"),
            Tool(name="campaign_advisor", func=lambda query: "Consejo: enfócate en redes sociales.", description="Proporciona consejos estratégicos")
        ]

        master_tools = [
            Tool(name="create_candidate_account", func=self.create_candidate_account_tool, description="Crea una nueva cuenta de tipo candidato. Requiere email y nombre."),
            Tool(name="create_leader_account", func=self.create_leader_account_tool, description="Crea una nueva cuenta de tipo líder. Requiere email y nombre."),
            Tool(name="create_voter_account", func=self.create_voter_account_tool, description="Crea una nueva cuenta de tipo votante. Requiere email y nombre."),
            Tool(name="create_publicidad_account", func=self.create_publicidad_account_tool, description="Crea una nueva cuenta de tipo publicidad. Requiere email y nombre."),
            Tool(name="update_color_palette", func=self.update_color_palette_tool, description="Actualiza la paleta de colores de la interfaz. Requiere un JSON con 'primary' y 'accent'."),
            Tool(name="add_data_to_network", func=self.add_data_to_network_tool, description="Añade una base de datos de usuarios (votantes, etc.) a la red."),
        ]
        
        ad_tools = [
            Tool(name="create_ad_copy", func=self.create_ad_copy_tool, description="Genera un texto publicitario (copy) para un evento o tema."),
        ]

        candidate_tools = [
            Tool(name="view_campaign_status", func=self.view_campaign_status_tool, description="Muestra un resumen del estado y rendimiento de la campaña."),
        ]

        leader_tools = [
            Tool(name="view_team_structure", func=self.view_team_structure_tool, description="Muestra un resumen de la red de líderes y voluntarios."),
            Tool(name="get_map_markers", func=self.get_map_markers_for_role_tool, description="Obtiene los marcadores geográficos relevantes para tu rol en el mapa."),
            Tool(name="configure_whatsapp_integration", func=self.configure_whatsapp_integration_tool, description="Configura la automatización de WhatsApp para tu red."),
        ]

        if tier == "master":
            tools.extend(master_tools)

        if tier == "publicidad":
            tools.extend(ad_tools)

        if tier == "candidato":
            tools.extend(candidate_tools)
            tools.append(Tool(name="get_map_markers", func=lambda q: self.get_map_markers_for_role_tool('candidato'), description="Obtiene tus marcadores de campaña en el mapa."))
        
        if tier == "lider":
            tools.extend(leader_tools)

        if tier == "developer":
            dev_tools = [
                Tool(name="create_master_account", func=self.create_master_account_tool, description="Crea una nueva cuenta de tipo master. Requiere email y nombre."),
                Tool(name="run_system_audit", func=self.run_system_audit_tool, description="Ejecuta una auditoría técnica completa del sistema y devuelve el resumen."),
            ]
            tools.extend(master_tools)
            tools.extend(dev_tools)
            tools.extend(ad_tools)
            tools.extend(candidate_tools)
            tools.extend(leader_tools)
            tools.append(Tool(name="get_all_map_markers", func=self.get_map_markers_for_role_tool, description="Obtiene los marcadores de mapa para un rol específico. La entrada es el nombre del rol."))

        return tools

    def _generate_welcome_message(self, tier: str) -> str:
        if tier == "developer":
            return "Acceso de Desarrollador concedido. Herramientas administrativas activadas. Bienvenido, Root."
        if tier == "master":
            return "Bienvenido, Master. Tus herramientas de gestión de equipo están listas."
        if tier == "candidato":
            return "Bienvenido, Candidato. Tu panel de control de campaña está activo. ¡Vamos a ganar!"
        if tier == "lider":
            return "Bienvenido, Líder. Tus herramientas de gestión de estructura están listas para movilizar."
        if tier == "publicidad":
            return "Bienvenido, estratega. Tus herramientas de publicidad y difusión están activas."
        if tier == "premium":
            return "¡Bienvenido al Comando Central Premium! Tu cerebro Agora está activado con poderes élite."
        else:
            return "¡Bienvenido al Comando Central! Tu cerebro básico está activo."

    def cleanup(self):
        pass

    def _load_configurations(self):
        pass

    def _check_limits(self, user_id: str) -> bool:
        return True

    def _update_usage_stats(self, user_id: str, request: str, response: str):
        pass

    # --- Herramientas para el Desarrollador ---
    def create_master_account_tool(self, user_data: str) -> str:
        """
        Crea una nueva cuenta de tipo master.
        La entrada debe ser un string como: "usuario 'nombre' con email 'email@ejemplo.com'"
        """
        return self._create_user_with_role(user_data, "master")

    def create_candidate_account_tool(self, user_data: str) -> str:
        """
        Crea una nueva cuenta de tipo candidato.
        La entrada debe ser un string como: "usuario 'nombre' con email 'email@ejemplo.com'"
        """
        return self._create_user_with_role(user_data, "candidato")

    def create_leader_account_tool(self, user_data: str) -> str:
        """
        Crea una nueva cuenta de tipo líder.
        La entrada debe ser un string como: "usuario 'nombre' con email 'email@ejemplo.com'"
        """
        return self._create_user_with_role(user_data, "lider")

    def create_voter_account_tool(self, user_data: str) -> str:
        """
        Crea una nueva cuenta de tipo votante.
        La entrada debe ser un string como: "usuario 'nombre' con email 'email@ejemplo.com'"
        """
        return self._create_user_with_role(user_data, "votante")

    def create_publicidad_account_tool(self, user_data: str) -> str:
        """
        Crea una nueva cuenta de tipo publicidad.
        La entrada debe ser un string como: "usuario 'nombre' con email 'email@ejemplo.com'"
        """
        return self._create_user_with_role(user_data, "publicidad")

    def _create_user_with_role(self, user_data: str, role: str) -> str:
        """Helper para crear usuarios con un rol específico."""
        if not self.auth_service:
            return f"Error: El servicio de autenticación no está disponible."

        name_match = re.search(r"(?:para el usuario|usuario)\s+'([^']+)'", user_data)
        email_match = re.search(r"email\s+'([^']+)'", user_data)

        if not name_match or not email_match:
            return f"Error: formato de entrada inválido. Se requiere: para el usuario 'nombre' con email 'email@ejemplo.com'"

        name = name_match.group(1)
        email = email_match.group(1)

        alphabet = string.ascii_letters + string.digits
        password = ''.join(secrets.choice(alphabet) for i in range(12))

        registration_data = {
            "email": email,
            "password": password,
            "full_name": name,
            "role": role
        }

        try:
            result = self.auth_service.register(registration_data)
            if result.get('success'):
                return f"Cuenta de {role} creada para {name} ({email}). Contraseña temporal: {password}. El usuario debe cambiarla."
            else:
                return f"Error al crear cuenta de {role}: {result.get('error', 'Desconocido')}"
        except Exception as e:
            return f"Excepción al crear cuenta de {role}: {e}"

    def run_system_audit_tool(self, query: str) -> str:
        """Simula una auditoría del sistema."""
        print(f"TOOL: Ejecutando auditoría del sistema con la consulta: {query}")
        return "Auditoría completada. Estado del sistema: Óptimo. Todos los servicios en línea."

    def create_n8n_workflow(self, user_id: str, workflow_data: Dict) -> Dict:
        """Crea un workflow en N8N"""
        try:
            if not self.n8n_url or not self.n8n_token:
                return {'error': 'N8N no configurado'}
            
            headers = {
                'X-N8N-API-KEY': self.n8n_token,
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.n8n_url}/workflows",
                json=workflow_data,
                headers=headers
            )
            
            if response.status_code == 200:
                workflow = response.json()
                return {'status': 'success', 'workflow_id': workflow['id']}
            else:
                return {'status': 'error', 'error': f"Error {response.status_code}: {response.text}"}
                    
        except Exception as e:
            return {'status': 'error', 'error': str(e)}

    def _get_usage_remaining(self, user_id: str) -> Dict:
        """Obtiene uso restante"""
        brain = self.active_brains.get(user_id)
        if not brain: return {}
        
        stats = brain['usage_stats']
        limits = brain['limits']
        
        return {
            'requests_remaining': limits['daily_requests'] - stats['requests_today'],
            'tokens_remaining': limits['monthly_tokens'] - stats['tokens_used_month']
        }

    def _generate_recommendations(self, user_id: str, request: str) -> List[Dict]:
        """Genera recomendaciones personalizadas"""
        brain = self.active_brains.get(user_id)
        if not brain:
            return []
        
        recommendations = []
        
        if "sentiment" in request.lower():
            recommendations.append({
                'type': 'workflow',
                'title': 'Monitoreo Automático',
                'description': 'Configura alertas de sentimiento',
                'action': 'create_sentiment_workflow'
            })
        
        if "crisis" in request.lower():
            recommendations.append({
                'type': 'training',
                'title': 'Simulacro de Crisis',
                'description': 'Practica respuestas a crisis',
                'action': 'start_crisis_simulation',
                'premium_only': True
            })
        
        return recommendations

    def _analyze_sentiment(self, text: str) -> Dict:
        """Analiza sentimiento de texto"""
        return {'sentiment': 'neutral', 'score': 0.0}

    def _get_campaign_advice(self, query: str) -> str:
        """Genera consejos de campaña"""
        return "Consejo genérico de campaña"

    def _monitor_real_time(self, params: Dict) -> Dict:
        """Monitoreo en tiempo real"""
        return {'status': 'monitoring'}

    def _simulate_crisis(self, scenario: str) -> Dict:
        """Simula escenarios de crisis"""
        return {'status': 'simulating'}

    # --- Herramientas para Publicidad ---
    def create_ad_copy_tool(self, topic: str) -> str:
        """
        Genera un texto publicitario corto y persuasivo para un tema específico.
        La entrada debe ser un string simple, ej: "un evento sobre seguridad ciudadana"
        """
        print(f"TOOL: Generando texto publicitario para: {topic}")
        return f"¡No te lo pierdas! Únete a nosotros en nuestro próximo evento sobre {topic}. Juntos construiremos un futuro más seguro. #Campaña #Seguridad #Participa"

    # --- Herramientas para Candidato ---
    def view_campaign_status_tool(self, query: str) -> str:
        """Obtiene un resumen del estado actual de la campaña."""
        print(f"TOOL: Consultando estado de la campaña con: {query}")
        return "Estado de la campaña: Positivo. El reconocimiento de nombre ha subido un 5% esta semana. El sentimiento en redes es mayormente favorable."

    # --- Herramientas para Lider ---
    def view_team_structure_tool(self, query: str) -> str:
        """Muestra la estructura del equipo o red de un líder."""
        print(f"TOOL: Consultando estructura de equipo con: {query}")
        return "Tu red actual consta de 5 líderes de zona y 32 voluntarios activos. El área con mayor crecimiento es la Comuna 5."

    # --- Herramientas para Master/Developer ---
    def update_color_palette_tool(self, theme_json: str) -> str:
        """
        Actualiza y guarda la paleta de colores de la interfaz de la aplicación.
        La entrada debe ser un string JSON con las claves 'primary' y 'accent'.
        Ejemplo: '{"primary": "#1E3A8A", "accent": "#FBBF24"}'
        """
        try:
            theme_data = json.loads(theme_json)
            if not all(k in theme_data for k in ['primary', 'accent']):
                return "Error: El JSON debe contener las claves 'primary' y 'accent'."

            # Asegurarse de que el directorio 'data' exista
            os.makedirs('data', exist_ok=True)
            
            with open('data/theme.json', 'w') as f:
                json.dump(theme_data, f)
            
            return "¡Perfecto! He actualizado la paleta de colores de la aplicación. Los cambios se aplicarán en la próxima recarga."
        except json.JSONDecodeError:
            return "Error: El formato del string de entrada no es un JSON válido."
        except Exception as e:
            return f"Error inesperado al guardar el tema: {e}"

    def get_map_markers_for_role_tool(self, role: str) -> str:
        """
        Obtiene los marcadores del mapa para un rol de usuario específico.
        La entrada debe ser un string con el rol, ej: 'candidato', 'lider', 'votante'.
        Devuelve un string JSON con la lista de marcadores.
        """
        try:
            if not os.path.exists('data/map_data.json'):
                return json.dumps({"error": "El archivo de datos del mapa no existe."})
            
            with open('data/map_data.json', 'r') as f:
                all_markers = json.load(f)
            
            # Devuelve los marcadores para el rol, o los por defecto si el rol no existe.
            role_markers = all_markers.get(role, all_markers.get('default', []))
            return json.dumps(role_markers)

        except Exception as e:
            return json.dumps({"error": f"Error al leer los datos del mapa: {e}"})

    def add_data_to_network_tool(self, data_json: str) -> str:
        """
        Procesa y añade datos de una red (votantes, líderes) al sistema.
        La entrada es un JSON que simula los datos de un archivo.
        Ej: '{"type": "votantes", "count": 50, "source": "archivo_local.csv"}'
        """
        try:
            data = json.loads(data_json)
            print(f"TOOL: Procesando {data.get('count')} registros de tipo {data.get('type')} desde {data.get('source')}.")
            return f"He procesado {data.get('count')} nuevos registros de {data.get('type')}. La red ha sido actualizada."
        except Exception as e:
            return f"Error al procesar los datos: {e}"

    def configure_whatsapp_integration_tool(self, config_json: str) -> str:
        """
        Configura la integración con WhatsApp/Sellerchat.
        La entrada es un JSON con los datos de configuración.
        Ej: '{"phone_number": "+123456789", "welcome_message": "Hola, soy el asistente de tu líder."}'
        """
        try:
            config = json.loads(config_json)
            print(f"TOOL: Configurando integración de WhatsApp para el número {config.get('phone_number')}.")
            return "¡Excelente! He configurado la integración de WhatsApp. El asistente ya está activo en ese número."
        except Exception as e:
            return f"Error al configurar la integración: {e}" 