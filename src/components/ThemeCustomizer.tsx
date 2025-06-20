import { FC, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ThemeCustomizer: FC = () => {
  const { theme, setTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [agoraResponse, setAgoraResponse] = useState('');

  const handleColorChange = (color: string, part: 'primary' | 'accent') => {
    setLocalTheme(prev => ({ ...prev, [part]: color }));
  };

  const applyThemeWithAgora = async () => {
    setIsLoading(true);
    setAgoraResponse('');

    // 1. Actualiza el tema localmente de inmediato para feedback visual
    setTheme(localTheme);

    // 2. Prepara y envía la orden al agente Agora
    const prompt = `Agora, por favor actualiza la paleta de colores de la aplicación. El nuevo JSON de tema es: ${JSON.stringify(localTheme)}`;
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'master_user_001', prompt }), // Asumimos un user_id de master
      });
      const data = await response.json();

      if (data.status === 'success') {
        setAgoraResponse(data.response);
      } else {
        setAgoraResponse(`Error de Agora: ${data.error}`);
      }
    } catch (error) {
      setAgoraResponse('Error de conexión con el servidor de Agora.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-agora-gold">Personalización de Tema</CardTitle>
        <CardDescription>
          Como Master, puedes cambiar los colores de la aplicación. Pídele a Agora que guarde los cambios.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="primary-color">Color Primario (Bordes, Fondos)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primary-color"
                type="color"
                value={localTheme.primary}
                onChange={(e) => handleColorChange(e.target.value, 'primary')}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={localTheme.primary}
                onChange={(e) => handleColorChange(e.target.value, 'primary')}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="accent-color">Color de Acento (Títulos, Botones)</Label>
            <div className="flex items-center space-x-2">
               <Input
                id="accent-color"
                type="color"
                value={localTheme.accent}
                onChange={(e) => handleColorChange(e.target.value, 'accent')}
                className="w-12 h-12 p-1"
              />
              <Input
                type="text"
                value={localTheme.accent}
                onChange={(e) => handleColorChange(e.target.value, 'accent')}
              />
            </div>
          </div>
        </div>
        <Button onClick={applyThemeWithAgora} disabled={isLoading} className="bg-agora-blue text-white hover:bg-opacity-90">
          {isLoading ? 'Aplicando...' : 'Aplicar Tema con Agora'}
        </Button>
        {agoraResponse && (
          <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-700">
            <strong>Respuesta de Agora:</strong> {agoraResponse}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeCustomizer; 