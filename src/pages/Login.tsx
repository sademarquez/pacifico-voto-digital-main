import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Lock, Users, ExternalLink, Play } from "lucide-react";
import { useSecureAuth } from "@/contexts/SecureAuthContext";
import { useDemoCredentials } from "@/hooks/useDemoCredentials";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppConfig } from "@/config/appConfig";
import TestLoginButton from "@/components/TestLoginButton";

const credenciales = [
  { label: "Candidato", username: "candidato", password: "12345678" },
  { label: "Master", username: "master", password: "12345678" },
  { label: "Líder", username: "lider", password: "12345678" },
  { label: "Publicidad", username: "publicidad", password: "12345678" },
  { label: "Votante", username: "votante", password: "12345678" },
  { label: "Desarrollador", username: "desarrollador", password: "12345678" },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSecureAuth();
  const { verifiedCredentials, getEmailFromName } = useDemoCredentials();
  const { app } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      toast({
        title: "¡Bienvenido al sistema!",
        description: "Autenticación exitosa - Accediendo al dashboard",
      });
    }
  }, [isAuthenticated, navigate, location.state, toast]);

  useEffect(() => {
    if (authError && (username || password)) {
      clearAuthError();
    }
  }, [username, password, authError, clearAuthError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({ title: "Campo requerido", description: "Ingresa tu nombre de usuario o email", variant: "destructive" });
      return;
    }
    if (!password.trim()) {
      toast({ title: "Campo requerido", description: "Ingresa tu contraseña", variant: "destructive" });
      return;
    }
    clearAuthError();
    try {
      let emailToUse = username.trim();
      if (!emailToUse.includes('@')) {
        const mappedEmail = getEmailFromName(username);
        if (mappedEmail) {
          emailToUse = mappedEmail;
        } else {
          toast({ title: "Usuario no encontrado", description: `No se encontró el usuario "${username}". Usa las credenciales demo.`, variant: "destructive" });
          return;
        }
      }
      const success = await login(emailToUse, password.trim());
      if (success) {
        toast({ title: "¡Login exitoso!", description: `Bienvenido ${username} - Cargando dashboard...` });
      }
    } catch (error) {
      toast({ title: "Error de sistema", description: "Error inesperado. Revisa las credenciales demo.", variant: "destructive" });
    }
  };

  const useCredential = (credential: any) => {
    setUsername(credential.name);
    setPassword(credential.password);
    clearAuthError();
    toast({ title: "Credenciales cargadas", description: `Listo para login como ${credential.name}` });
  };

  const handleVisitorAccess = () => {
    if (app.landingUrl && app.landingUrl !== "https://tu-dominio.com/landing") {
      window.open(app.landingUrl, '_blank');
      toast({ title: "Acceso de Visitante", description: "Abriendo landing page en nueva ventana" });
    } else {
      navigate(app.visitorFunnelUrl);
      toast({ title: "Acceso de Visitante", description: "Redirigiendo al funnel de visitantes" });
    }
  };

  const handleDemoAccess = () => {
    navigate('/dashboard');
    toast({ title: "¡Acceso Demo Directo!", description: "Explorando el sistema sin restricciones" });
  };

  const loginRapido = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    // Aquí iría la lógica real de login automático
    alert(`Login rápido como ${user}`);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-negro-50 via-verde-sistema-50 to-negro-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-sistema-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-verde-sistema-600">¡Autenticado!</h2>
          <p className="text-negro-600">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#e6f0f7]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl font-extrabold text-[#009fe3]">MI</span>
            <span className="ml-2 text-xl font-bold text-gray-500">CAMPAÑA <span className="text-[#009fe3]">IA</span></span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 text-center">Iniciar sesión</h2>
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario o email"
            className="w-full mb-3 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009fe3]"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009fe3]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#009fe3] text-white font-bold py-2 rounded-lg shadow hover:bg-[#007bbd] transition mb-4"
          >
            Ingresar
          </button>
        </form>
        <div className="w-full flex flex-col gap-2 mt-2">
          {credenciales.map((cred) => (
            <button
              key={cred.label}
              className="w-full bg-gray-100 hover:bg-[#009fe3] hover:text-white text-gray-700 font-semibold py-2 rounded-lg border border-gray-200 transition"
              onClick={() => loginRapido(cred.username, cred.password)}
            >
              Ingresar como {cred.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login; 