import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseConfig, saveSupabaseConfig, SupabaseConfig } from '@/services/configService';
import { Shield } from 'lucide-react';

const ConfiguracionDesarrollador = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SupabaseConfig>({ url: '', anonKey: '' });

  useEffect(() => {
    const loadedConfig = getSupabaseConfig();
    if (loadedConfig) {
      setConfig(loadedConfig);
    }
  }, []);

  const handleSave = () => {
    saveSupabaseConfig(config);
    toast({
      title: 'Configuración guardada',
      description: 'La configuración de Supabase se ha guardado correctamente. Refresca la página para aplicar los cambios.',
    });
  };

  return (
    <Card className="bg-glass shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Shield className="w-7 h-7 text-primary" />
          Configuración de Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="supabaseUrl">URL de Supabase</Label>
          <Input
            id="supabaseUrl"
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            placeholder="https://xxxxxxxx.supabase.co"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabaseAnonKey">Clave Anónima de Supabase</Label>
          <Input
            id="supabaseAnonKey"
            type="password"
            value={config.anonKey}
            onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>
        <Button onClick={handleSave}>Guardar Configuración</Button>
      </CardContent>
    </Card>
  );
};

export default ConfiguracionDesarrollador;
