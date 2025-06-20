import { FC } from "react";

interface Tool {
  icon: React.ReactNode;
  name: string;
  description: string;
  onClick?: () => void;
}

interface AgentToolsProps {
  tools: Tool[];
}

const AgentTools: FC<AgentToolsProps> = ({ tools }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.onClick}
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 border-2 border-[#009fe3] hover:bg-[#e6f0f7] transition"
        >
          <div className="text-[#009fe3] text-3xl">{tool.icon}</div>
          <div className="text-left">
            <div className="font-bold text-lg text-gray-800">{tool.name}</div>
            <div className="text-sm text-gray-500">{tool.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default AgentTools; 