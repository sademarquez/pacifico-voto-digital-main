import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./components/Navigation";
import ChatbotProvider from "./components/ChatbotProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import BottomNavBar from "@/components/BottomNavBar";

// Importar solo las páginas que existen
import Inicio from "./pages/Inicio";
import Mapa from "./pages/Mapa";
import Dashboard from "./pages/Dashboard";
import Estructura from "./pages/Estructura";
import Configuracion from "./pages/Configuracion";
import Index from "./pages/Index";
import Informes from "./pages/Informes";
import Liderazgo from "./pages/Liderazgo";
import LugarVotacion from "./pages/LugarVotacion";
import MapaAlertas from "./pages/MapaAlertas";
import Mensajes from "./pages/Mensajes";
import NotFound from "./pages/NotFound";
import RedAyudantes from "./pages/RedAyudantes";
import Registro from "./pages/Registro";
import ReportePublicidad from "./pages/ReportePublicidad";
import UbicacionVotantes from "./pages/UbicacionVotantes";
import Candidato from "./pages/Candidato";
import SuministroDatos from "./pages/SuministroDatos";
import AutomatizacionLider from "./pages/AutomatizacionLider";


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/estructura" element={<Estructura />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="/candidato" element={<Candidato />} />
                <Route path="/suministro-datos" element={<SuministroDatos />} />
                <Route path="/automatizacion-lider" element={<AutomatizacionLider />} />
                
                {/* Rutas originales */}
                <Route path="/index" element={<Index />} />
                <Route path="/informes" element={<Informes />} />
                <Route path="/liderazgo" element={<Liderazgo />} />
                <Route path="/lugar-votacion" element={<LugarVotacion />} />
                <Route path="/mapa-alertas" element={<MapaAlertas />} />
                <Route path="/mensajes" element={<Mensajes />} />
                <Route path="/red-ayudantes" element={<RedAyudantes />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/reporte-publicidad" element={<ReportePublicidad />} />
                <Route path="/ubicacion-votantes" element={<UbicacionVotantes />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatbotProvider />
              <BottomNavBar />
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
