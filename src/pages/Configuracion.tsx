import { FC } from "react";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import AgentTools from "@/components/AgentTools";
import { Zap, Instagram, MessageCircle, Settings2 } from "lucide-react";

const Configuracion: FC = () => {
  const tools = [
    { icon: <Zap />, name: "Integración n8n", description: "Conecta y automatiza procesos." },
    { icon: <Instagram />, name: "Instagram API", description: "Gestiona comunicación y campañas." },
    { icon: <MessageCircle />, name: "WhatsApp/Sellerchat", description: "Automatiza mensajes y respuestas." },
    { icon: <Settings2 />, name: "Facebook Pixel", description: "Monitorea conversiones y tráfico." },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración General</h1>
        <p className="mt-2 text-gray-600">
          Ajustes y personalización para la plataforma Agora.
        </p>
      </div>
      
      <ThemeCustomizer />

      <AgentTools tools={tools} />

      {/* Integraciones */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-blue-600" /> Integraciones de Canales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-blue-50">
            <div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-blue-600" /> n8n</div>
            <input type="text" placeholder="URL de n8n" className="w-full border rounded px-2 py-1" defaultValue="http://localhost:5678" />
          </div>
          <div className="p-4 border rounded bg-pink-50">
            <div className="flex items-center gap-2 mb-2"><Instagram className="w-4 h-4 text-pink-600" /> Instagram</div>
            <input type="text" placeholder="Usuario/Token Instagram" className="w-full border rounded px-2 py-1" />
          </div>
          <div className="p-4 border rounded bg-green-50">
            <div className="flex items-center gap-2 mb-2"><MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp/Sellerchat</div>
            <input type="text" placeholder="Número o API Key Sellerchat" className="w-full border rounded px-2 py-1" />
          </div>
          <div className="p-4 border rounded bg-gray-50">
            <div className="flex items-center gap-2 mb-2"><Settings2 className="w-4 h-4 text-gray-600" /> Facebook Pixel</div>
            <input type="text" placeholder="ID de Pixel" className="w-full border rounded px-2 py-1" />
          </div>
        </div>
      </div>

      {/* Aquí se pueden añadir más secciones de configuración en el futuro */}
    </div>
  );
};

export default Configuracion;
