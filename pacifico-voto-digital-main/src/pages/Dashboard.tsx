
import { useSecureAuth } from "../contexts/SecureAuthContext";
import Navigation from "../components/Navigation";
import DashboardDesarrollador from "../components/DashboardDesarrollador";
import DashboardMaster from "../components/DashboardMaster";
import DashboardCandidato from "../components/DashboardCandidato";
import DashboardLider from "../components/DashboardLider";
import DashboardVotante from "../components/DashboardVotante";

const Dashboard = () => {
  const { user } = useSecureAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-negro-50 to-verde-sistema-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-sistema-600 mx-auto mb-4"></div>
          <p className="text-negro-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const renderDashboardByRole = () => {
    switch (user.role) {
      case "desarrollador":
        return <DashboardDesarrollador />;
      case "master":
        return <DashboardMaster />;
      case "candidato":
        return <DashboardCandidato />;
      case "lider":
        return <DashboardLider />;
      case "votante":
        return <DashboardVotante />;
      default:
        return <DashboardVotante />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-negro-50 via-white to-verde-sistema-50">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        {renderDashboardByRole()}
      </div>
    </div>
  );
};

export default Dashboard;
