import { FC } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Upload, BarChart3, Users, Filter } from "lucide-react";
import TestingButton from "@/components/TestingButton";
import AgentTools from "@/components/AgentTools";

const SuministroDatos: FC = () => {
  const tools = [
    { icon: <Upload />, name: "Cargar base de datos", description: "Sube y gestiona tus datos de votantes." },
    { icon: <BarChart3 />, name: "Análisis de datos", description: "Obtén insights y segmenta tu audiencia." },
    { icon: <Users />, name: "Segmentación de red", description: "Organiza tu estructura territorial." },
    { icon: <Filter />, name: "Filtrar registros", description: "Encuentra y clasifica información relevante." },
  ];

  return (
    <PageWrapper
      title="Suministro de Datos"
      description="Carga y gestiona las bases de datos de tu red (líderes, votantes, etc.)."
      icon={Upload}
    >
      <TestingButton label="Test Datos" onTest={() => alert('Funcionalidad de prueba en Suministro de Datos')} />
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <h2 className="text-xl font-semibold text-agora-text-primary">Próximamente: Carga de Archivos</h2>
        <p className="mt-2 text-agora-text-secondary">
          Aquí podrás arrastrar y soltar archivos CSV o Excel para que Agora los procese y estructure tu red automáticamente.
        </p>
      </div>
      <AgentTools tools={tools} />
    </PageWrapper>
  );
};

export default SuministroDatos; 