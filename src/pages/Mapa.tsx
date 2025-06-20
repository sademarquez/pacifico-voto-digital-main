import { FC, useState } from "react";
import CampaignMap from "@/components/CampaignMap";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import { MapPin } from "lucide-react";
import TestingButton from "@/components/TestingButton";

const Mapa: FC = () => {
  const [currentRole, setCurrentRole] = useState('candidato');

  return (
    <PageWrapper
      title="Tablero Geoespacial"
      description="Visualización de la estructura de campaña y datos territoriales en tiempo real."
      icon={MapPin}
    >
      <TestingButton label="Test Mapa" onTest={() => alert('Funcionalidad de prueba en Mapa')} />
      <div className="flex flex-col h-[calc(100vh-220px)]">
        <div className="mb-4">
          <p className="text-agora-text-secondary">
            Cambiando la vista para simular el rol de: <span className="font-bold text-agora-blue">{currentRole}</span>
          </p>
          <div className="mt-2 flex space-x-2">
              <Button onClick={() => setCurrentRole('candidato')} variant={currentRole === 'candidato' ? 'default' : 'outline'}>
                Vista Candidato
              </Button>
              <Button onClick={() => setCurrentRole('lider')} variant={currentRole === 'lider' ? 'default' : 'outline'}>
                Vista Líder
              </Button>
              <Button onClick={() => setCurrentRole('votante')} variant={currentRole === 'votante' ? 'default' : 'outline'}>
                Vista Votante
              </Button>
          </div>
        </div>
        <div className="flex-grow rounded-lg overflow-hidden border-2 border-agora-blue">
          <CampaignMap role={currentRole} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Mapa; 