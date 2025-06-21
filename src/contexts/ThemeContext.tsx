import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';

interface Theme {
  primary: string;
  accent: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    primary: '#1E3A8A', // Valor inicial por defecto
    accent: '#FBBF24',
  });

  // Al cargar, obtener el tema de la API
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('/api/theme');
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme);
        }
      } catch (error) {
        console.error("No se pudo cargar el tema de la API, usando valores por defecto.", error);
      }
    };
    fetchTheme();
  }, []);

  // Cuando el tema cambie, aplicar los estilos al :root
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
}; 