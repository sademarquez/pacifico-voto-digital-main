import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, MapPin, Users, BarChart3, Shield, Network, User, Settings, Upload, Bot } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { href: "/inicio", label: "Inicio", icon: Home },
    { href: "/mapa", label: "Mapa", icon: MapPin },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { href: "/liderazgo", label: "Liderazgo", icon: Users },
    { href: "/candidato", label: "Candidato", icon: User },
    { href: "/estructura", label: "Estructura", icon: Network },
    { href: "/reporte-publicidad", label: "Publicidad", icon: Shield },
    { href: "/suministro-datos", label: "Suministro Datos", icon: Upload },
    { href: "/automatizacion-lider", label: "Automatización", icon: Bot },
    { href: "/configuracion", label: "Configuración", icon: Settings },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  const NavLink = ({ href, label, icon: Icon }: any) => (
    <Link
      to={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActiveRoute(href)
          ? 'bg-agora-blue text-white'
          : 'text-agora-text-secondary hover:bg-gray-100 hover:text-agora-text-primary'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
  
  const MobileNavLink = ({ href, label, icon: Icon, onClick }: any) => (
      <Link
        to={href}
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-base ${
            isActiveRoute(href)
            ? 'bg-agora-blue text-white'
            : 'text-agora-text-primary hover:bg-gray-100'
        }`}
      >
        <Icon className="w-6 h-6" />
        <span className="font-medium">{label}</span>
      </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-agora-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-agora-blue">
            AGORA<span className="text-agora-gold">.</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
            {primaryNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-agora-blue" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-agora-background">
              <div className="flex flex-col space-y-2 mt-8">
                {primaryNavItems.map((item) => (
                  <MobileNavLink key={item.href} {...item} onClick={() => setIsOpen(false)} />
                ))}
                <div className="px-3 py-2 text-xs font-semibold text-agora-text-secondary uppercase">Módulos</div>
                {secondaryNavItems.map((item) => (
                  <MobileNavLink key={item.href} {...item} onClick={() => setIsOpen(false)} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
