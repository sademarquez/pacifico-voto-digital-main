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
    <div>
      <h1 className="text-3xl font-bold text-negro-950 mb-2">Dashboard Master</h1>
      <p className="text-negro-600 mb-8">
        Este es el dashboard para el rol de master.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterData.map((data, index) => (
          <div key={index} className="p-4 border-2 border-verde-sistema-100 rounded-lg">
            <h2 className="font-bold text-lg text-negro-900">{data.name}</h2>
            <p className="text-sm text-negro-600">{data.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMaster;
