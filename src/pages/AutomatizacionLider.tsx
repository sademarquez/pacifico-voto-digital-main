import { FC } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Bot } from "lucide-react";
import TestingButton from "@/components/TestingButton";

const AutomatizacionLider: FC = () => {
  return (
    <PageWrapper
      title="Automatización para Líderes"
      description="Conecta tus herramientas de comunicación y automatiza tareas repetitivas."
      icon={Bot}
    >
      <TestingButton label="Test Automatización" onTest={() => alert('Funcionalidad de prueba en Automatización para Líderes')} />
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold text-agora-text-primary">Próximamente: Integración con WhatsApp & Sellerchat</h2>
        <p className="mt-2 text-agora-text-secondary">
          Este será el centro de control para configurar respuestas automáticas,
          programar recordatorios y gestionar tu red de comunicación de forma eficiente.
        </p>
      </div>
    </PageWrapper>
  );
};

export default AutomatizacionLider; 