import { Home, MapPin, BarChart3, MessageSquare, User } from "lucide-react";

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#009fe3]/80 backdrop-blur-md shadow-lg md:hidden">
      <a href="/" className="flex flex-col items-center text-white hover:text-blue-200 transition">
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Inicio</span>
      </a>
      <a href="/mapa" className="flex flex-col items-center text-white hover:text-blue-200 transition">
        <MapPin className="w-6 h-6" />
        <span className="text-xs mt-1">Mapa</span>
      </a>
      <a href="/dashboard" className="flex flex-col items-center text-white hover:text-blue-200 transition">
        <BarChart3 className="w-6 h-6" />
        <span className="text-xs mt-1">Dashboard</span>
      </a>
      <a href="/mensajes" className="flex flex-col items-center text-white hover:text-blue-200 transition">
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs mt-1">Mensajes</span>
      </a>
      <a href="/perfil" className="flex flex-col items-center text-white hover:text-blue-200 transition">
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">Perfil</span>
      </a>
    </nav>
  );
};

export default BottomNavBar; 