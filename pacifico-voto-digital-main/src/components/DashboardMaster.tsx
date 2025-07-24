import React, { useState, useEffect } from 'react';
import { getMasterData } from '@/services/supabaseService';

const DashboardMaster = () => {
  const [masterData, setMasterData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const data = await getMasterData();
        setMasterData(data);
      } catch (error) {
        console.error("Error fetching master data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-sistema-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-glass p-8 rounded-lg shadow-hard">
        <h1 className="text-4xl font-bold text-foreground">Dashboard Master</h1>
        <p className="text-lg text-muted-foreground">Visión general y control total de la campaña.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {masterData.map((data, index) => (
          <Card key={index} className="bg-glass shadow-medium">
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{data.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardMaster;
