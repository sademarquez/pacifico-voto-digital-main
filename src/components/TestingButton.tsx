import { FC } from 'react';

interface TestingButtonProps {
  label?: string;
  onTest?: () => void;
}

const isTesting = import.meta.env.VITE_AGORA_TESTING === 'true';

const TestingButton: FC<TestingButtonProps> = ({ label = 'Test', onTest }) => {
  if (!isTesting) return null;

  return (
    <button
      onClick={onTest}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-lg bg-agora-gold text-white font-bold shadow-lg hover:bg-yellow-400 transition-all border-2 border-agora-blue"
      style={{ minWidth: 80 }}
    >
      {label}
    </button>
  );
};

export default TestingButton; 