import { FC } from 'react';

interface TestLoginButtonProps {
  label: string;
  onLogin: () => void;
}

const isTesting = import.meta.env.VITE_AGORA_TESTING === 'true';

const TestLoginButton: FC<TestLoginButtonProps> = ({ label, onLogin }) => {
  if (!isTesting) return null;

  return (
    <button
      onClick={onLogin}
      className="w-full mb-4 px-4 py-2 rounded-lg bg-agora-gold text-white font-bold shadow hover:bg-yellow-400 border-2 border-agora-blue transition-all"
    >
      {label}
    </button>
  );
};

export default TestLoginButton; 