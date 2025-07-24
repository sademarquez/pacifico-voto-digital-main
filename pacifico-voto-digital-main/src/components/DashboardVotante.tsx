
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSecureAuth } from "../contexts/SecureAuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Target,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Star,
  Gift,
  Trophy,
  Zap,
  Heart,
  ArrowRight,
  Award,
  Globe
} from "lucide-react";

const DashboardVotante = () => {
  const { user } = useSecureAuth();
  const navigate = useNavigate();
  const [activeGoal, setActiveGoal] = useState(0);

  const {
    data: voterGoals,
    isLoading: isLoadingVoterGoals,
  } = useQuery({
    queryKey: ["voterGoals"],
    queryFn: getVoterGoals,
  });

  const {
    data: upcomingEvents,
    isLoading: isLoadingUpcomingEvents,
  } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: getUpcomingEvents,
  });

  const {
    data: achievements,
    isLoading: isLoadingAchievements,
  } = useQuery({
    queryKey: ["achievements"],
    queryFn: getAchievements,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header personalizado elegante */}
      <div className="bg-glass p-8 rounded-lg shadow-hard animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-medium">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                ¡Bienvenido, {user?.name}! 🌟
              </h1>
              <p className="text-lg text-muted-foreground">
                Tu participación construye el futuro.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/visitor-funnel")}
            className="hidden md:flex"
          >
            <Globe className="w-5 h-5 mr-2" />
            Explorar Zona
          </Button>
        </div>

        <div className="bg-background/50 p-6 rounded-lg shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Tu Impacto</h3>
            <span className="text-2xl font-bold text-primary">85%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-4">
            <div className="bg-primary h-4 rounded-full" style={{width: '85%'}}></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-glass shadow-medium animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="w-7 h-7 text-primary" />
              Mis Objetivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {voterGoals?.map((goal: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-soft ${
                  activeGoal === index
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent'
                }`}
                onClick={() => setActiveGoal(index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{goal.title}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{width: `${goal.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-glass shadow-medium animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calendar className="w-7 h-7 text-accent" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents?.map((event: any, index: number) => (
              <div key={index} className="p-4 bg-background/50 rounded-lg shadow-soft">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{event.name}</h4>
                  <Badge variant="secondary">{event.participants} personas</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/dashboard?tab=events")}
                >
                  Confirmar Asistencia
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-glass shadow-medium animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Award className="w-7 h-7 text-primary" />
            Logros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements?.map((achievement: any, index: number) => (
              <div key={index} className="text-center p-6 bg-background/50 rounded-lg shadow-soft">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardVotante;
