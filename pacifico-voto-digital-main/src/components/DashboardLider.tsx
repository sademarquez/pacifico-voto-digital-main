import React, { useState, useEffect } from 'react';
import { getLeaderData } from '@/services/supabaseService';

const DashboardLider = () => {
  const [leaderData, setLeaderData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderData = async () => {
      try {
        const data = await getLeaderData();
        setLeaderData(data);
      } catch (error) {
        console.error("Error fetching leader data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderData();
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
        <h1 className="text-4xl font-bold text-foreground">Dashboard Líder</h1>
        <p className="text-lg text-muted-foreground">Coordina a tu equipo y moviliza a tus votantes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leaderData.map((data, index) => (
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

export default DashboardLider;
