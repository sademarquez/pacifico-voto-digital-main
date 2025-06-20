import { FC, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 4.624335,
  lng: -74.063644
};

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  type: string;
}

interface CampaignMapProps {
  role: string;
}

const CampaignMap: FC<CampaignMapProps> = ({ role }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/map_data?role=${role}`);
        const data: MapMarker[] = await response.json();
        if (Array.isArray(data)) {
            setMarkers(data);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchMapData();
  }, [role]);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      {markers.map((marker, index) => (
        <MarkerF
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
          label={{ text: marker.label, className: 'marker-label' }}
        />
      ))}
    </GoogleMap>
  );
};

export default CampaignMap; 