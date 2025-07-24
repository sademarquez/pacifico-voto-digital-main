
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useSecureAuth();
  const { verifiedCredentials, getEmailFromName } = useDemoCredentials();
  const { app } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ USUARIO AUTENTICADO - REDIRIGIENDO A DASHBOARD');
      
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('🎯 REDIRIGIENDO A:', from);
      
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
    
    console.log('🔐 INTENTO DE LOGIN:', { username, hasPassword: !!password });
    
    if (!username.trim()) {
      toast({
        title: "Campo requerido",
        description: "Ingresa tu nombre de usuario o email",
        variant: "destructive"
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: "Campo requerido", 
        description: "Ingresa tu contraseña",
        variant: "destructive"
      });
      return;
    }

    clearAuthError();

    try {
      let emailToUse = username.trim();
      
      if (!emailToUse.includes('@')) {
        const mappedEmail = getEmailFromName(username);
        if (mappedEmail) {
          emailToUse = mappedEmail;
          console.log(`✅ MAPEANDO USUARIO: "${username}" → "${emailToUse}"`);
        } else {
          toast({
            title: "Usuario no encontrado",
            description: `No se encontró el usuario "${username}". Usa las credenciales demo.`,
            variant: "destructive"
          });
          return;
        }
      }

      console.log(`🔐 EJECUTANDO LOGIN:`, { 
        inputUsername: username,
        emailToUse,
        password: password ? '[PRESENTE]' : '[VACÍO]'
      });

      const success = await login(emailToUse, password.trim());
      
      if (success) {
        console.log('🎉 LOGIN EXITOSO - ESPERANDO REDIRECCIÓN AUTOMÁTICA');
        toast({
          title: "¡Login exitoso!",
          description: `Bienvenido ${username} - Cargando dashboard...`,
        });
      } else {
        console.log('❌ LOGIN FALLÓ');
      }
    } catch (error) {
      console.error('💥 ERROR DURANTE EL LOGIN:', error);
      toast({
        title: "Error de sistema",
        description: "Error inesperado. Revisa las credenciales demo.",
        variant: "destructive"
      });
    }
  };

  const useCredential = (credential: any) => {
    console.log('🎯 USANDO CREDENCIAL:', credential.name);
    setUsername(credential.email);
    setPassword(credential.password);
    clearAuthError();
    toast({
      title: "Credenciales cargadas",
      description: `Listo para login como ${credential.name}`,
    });
  };

  const handleVisitorAccess = () => {
    console.log('🚀 ACCESO DE VISITANTE - REDIRIGIENDO A FUNNEL');
    
    if (app.landingUrl && app.landingUrl !== "https://tu-dominio.com/landing") {
      window.open(app.landingUrl, '_blank');
      toast({
        title: "Acceso de Visitante",
        description: "Abriendo landing page en nueva ventana",
      });
    } else {
      navigate(app.visitorFunnelUrl);
      toast({
        title: "Acceso de Visitante",
        description: "Redirigiendo al funnel de visitantes",
      });
    }
  };

  const handleDemoAccess = () => {
    console.log('🎮 ACCESO DIRECTO AL DEMO');
    navigate('/dashboard');
    toast({
      title: "¡Acceso Demo Directo!",
      description: "Explorando el sistema sin restricciones",
    });
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          
          {/* Panel de Login */}
          <Card className="w-full bg-glass border-2 border-primary/20 shadow-hard animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
                <Shield className="text-white w-10 h-10" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                {app.companyName}
              </CardTitle>
              <p className="text-muted-foreground">{app.systemName}</p>
              {app.demoMode && (
                <div className="bg-primary/10 p-2 rounded-lg mt-4 border border-primary/20">
                  <p className="text-primary text-sm font-medium">🎮 MODO DEMO ACTIVO</p>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Usuario o Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ej: dev@demo.com"
                      className="pl-10 h-12 text-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 h-12 text-lg"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 h-12 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Autenticando..." : "Iniciar Sesión"}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDemoAccess}
                      className="h-12 text-lg"
                      disabled={isLoading}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Demo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleVisitorAccess}
                      className="h-12 text-lg"
                      disabled={isLoading}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Visitante
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Panel de Credenciales Demo */}
          {showCredentials && (
            <Card className="w-full bg-glass border-2 border-primary/20 shadow-hard animate-slide-up">
              <CardHeader>
                <CardTitle className="text-foreground text-2xl flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-accent" />
                  Credenciales de Acceso
                </CardTitle>
                <p className="text-muted-foreground">Utiliza estos perfiles para explorar la PWA.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verifiedCredentials.map((cred) => (
                    <div key={cred.email} className="p-4 bg-background/50 rounded-lg hover:bg-background transition-colors shadow-soft">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg text-foreground">{cred.name}</div>
                          <div className="text-sm text-muted-foreground">{cred.description}</div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => useCredential(cred)}
                          disabled={isLoading}
                        >
                          Usar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
