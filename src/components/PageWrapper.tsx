import { FC, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageWrapperProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

const PageWrapper: FC<PageWrapperProps> = ({ title, description, icon: Icon, children }) => {
  return (
    <div className="flex-1 p-8 bg-white">
      <header className="pb-6 border-b-2 border-agora-blue">
        <div className="flex items-center space-x-4">
          <Icon className="w-10 h-10 text-agora-gold" />
          <div>
            <h1 className="text-3xl font-bold text-agora-gold">{title}</h1>
            <p className="mt-1 text-agora-text-secondary">{description}</p>
          </div>
        </div>
      </header>
      <main className="mt-8">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper; 