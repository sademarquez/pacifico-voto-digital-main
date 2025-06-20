import { FC, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { User, Users, Zap, Instagram, MessageCircle, Download, Plus, Settings2 } from "lucide-react";
import TestingButton from "@/components/TestingButton";
import AgentTools from "@/components/AgentTools";

const mockTeam = [
  { nombre: "Ana López", rol: "Líder de zona", canal: "WhatsApp", tareas: 12 },
  { nombre: "Carlos Pérez", rol: "Voluntario", canal: "Instagram", tareas: 7 },
];

const tools = [
  { icon: <Users />, name: "Equipo de campaña", description: "Gestiona tu equipo y roles." },
  { icon: <MapPin />, name: "Mapa de votantes", description: "Visualiza y segmenta tu territorio." },
  { icon: <MessageSquare />, name: "Mensajes", description: "Comunica a tu red y votantes." },
  { icon: <BarChart3 />, name: "Reportes de campaña", description: "Analiza el rendimiento y KPIs." },
];

const Candidato: FC = () => {
  const [team, setTeam] = useState(mockTeam);
  const [nuevoMiembro, setNuevoMiembro] = useState("");
  const [canal, setCanal] = useState("WhatsApp");

  const agregarMiembro = () => {
    if (nuevoMiembro.trim()) {
      setTeam([...team, { nombre: nuevoMiembro, rol: "Agente", canal, tareas: 0 }]);
      setNuevoMiembro("");
    }
  };

  return (
    <PageWrapper
      title="Panel del Candidato"
      description="Tu centro de mando personal. Agenda, métricas de campaña y herramientas de comunicación."
      icon={User}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Accesos rápidos a integraciones */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-blue-600" /> Automatizaciones & Integraciones</h2>
          <div className="flex flex-wrap gap-3">
            <a href="http://localhost:5678" target="_blank" rel="noopener" className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 flex items-center gap-2 font-semibold"><Zap className="w-4 h-4 text-blue-600" /> n8n</a>
            <a href="#" className="px-4 py-2 rounded bg-pink-100 hover:bg-pink-200 flex items-center gap-2 font-semibold"><Instagram className="w-4 h-4 text-pink-600" /> Instagram</a>
            <a href="#" className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 flex items-center gap-2 font-semibold"><MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp/Sellerchat</a>
            <a href="#" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2 font-semibold"><Settings2 className="w-4 h-4 text-gray-600" /> Facebook Pixel</a>
          </div>
        </div>
        {/* Equipo de campaña */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Equipo de Campaña</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" value={nuevoMiembro} onChange={e => setNuevoMiembro(e.target.value)} placeholder="Nombre del nuevo miembro" className="border rounded px-2 py-1" />
            <select value={canal} onChange={e => setCanal(e.target.value)} className="border rounded px-2 py-1">
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
            </select>
            <button onClick={agregarMiembro} className="bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus className="w-4 h-4" /> Agregar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-purple-100">
                  <th className="px-2 py-1">Nombre</th>
                  <th className="px-2 py-1">Rol</th>
                  <th className="px-2 py-1">Canal</th>
                  <th className="px-2 py-1">Tareas</th>
                  <th className="px-2 py-1">Descargar</th>
                </tr>
              </thead>
              <tbody>
                {team.map((m, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-2 py-1">{m.nombre}</td>
                    <td className="px-2 py-1">{m.rol}</td>
                    <td className="px-2 py-1">{m.canal}</td>
                    <td className="px-2 py-1 text-center">{m.tareas}</td>
                    <td className="px-2 py-1 text-center">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"><Download className="w-4 h-4" /> Reporte</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-500 mt-2">Cada miembro puede acceder a la automatización de Agora por Instagram o WhatsApp. Personaliza la comunicación desde n8n o Sellerchat.</div>
        </div>
      </div>
      <AgentTools tools={tools} />
      <TestingButton label="Test Candidato" onTest={() => alert('Funcionalidad de prueba en Candidato')} />
      <p>Aquí se mostrarán los KPIs específicos para el candidato.</p>
    </PageWrapper>
  );
};

export default Candidato; 