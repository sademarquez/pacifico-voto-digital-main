import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, MapPin, TrendingUp, Calendar, Target, Zap, Instagram, MessageCircle, Settings2, Shield } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AgentTools from "@/components/AgentTools";

const Dashboard = () => {
  const metricsData = [
    { name: 'Ene', votos: 1200, eventos: 15 },
    { name: 'Feb', votos: 1800, eventos: 22 },
    { name: 'Mar', votos: 2400, eventos: 28 },
    { name: 'Abr', votos: 3100, eventos: 35 },
    { name: 'May', votos: 3800, eventos: 42 },
    { name: 'Jun', votos: 4500, eventos: 38 }
  ];

  const municipiosData = [
    { municipio: 'Popayán', porcentaje: 78 },
    { municipio: 'Santander', porcentaje: 65 },
    { municipio: 'Timbío', porcentaje: 72 },
    { municipio: 'La Vega', porcentaje: 58 }
  ];

  const tools = [
    { icon: <Users />, name: "Gestión de usuarios", description: "Administra credenciales y roles." },
    { icon: <Zap />, name: "Automatización (n8n)", description: "Crea y gestiona flujos automáticos." },
    { icon: <Settings2 />, name: "Configuración avanzada", description: "Personaliza la plataforma." },
    { icon: <Shield />, name: "Auditoría del sistema", description: "Monitorea y revisa logs y seguridad." },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Accesos rápidos a integraciones */}
      <div className="flex flex-wrap gap-3 mb-8">
        <a href="http://localhost:5678" target="_blank" rel="noopener" className="px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 flex items-center gap-2 font-semibold"><Zap className="w-4 h-4 text-blue-600" /> n8n</a>
        <a href="#" className="px-4 py-2 rounded bg-pink-100 hover:bg-pink-200 flex items-center gap-2 font-semibold"><Instagram className="w-4 h-4 text-pink-600" /> Instagram</a>
        <a href="#" className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 flex items-center gap-2 font-semibold"><MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp/Sellerchat</a>
        <a href="#" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center gap-2 font-semibold"><Settings2 className="w-4 h-4 text-gray-600" /> Facebook Pixel</a>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <span>Dashboard</span>
        </h1>
        <p className="text-gray-600">Panel de control y métricas de campaña</p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,523</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Municipios</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              89% de cobertura total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">
              38 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Votos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              De la meta establecida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Votantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="votos" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="eventos" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por Municipio */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Municipio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {municipiosData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.municipio}</span>
                  <span className="text-sm text-muted-foreground">{item.porcentaje}%</span>
                </div>
                <Progress value={item.porcentaje} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AgentTools tools={tools} />
    </div>
  );
};

export default Dashboard;
