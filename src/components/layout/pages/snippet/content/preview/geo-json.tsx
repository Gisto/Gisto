import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useTheme } from '@/components/theme/theme-provider.tsx';
import { GistFileType } from '@/types/gist.ts';

type JsonType = Record<string, unknown> | Record<string, unknown>[];

const GeoJsonLayer = ({ data }: { data: JsonType }) => {
  const map = useMap();

  useEffect(() => {
    if (data) {
      const geoJsonLayer = L.geoJSON(data as never);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds);
    }
  }, [data, map]);

  return <GeoJSON data={data as never} />;
};

export const GeoJson = ({ file }: { file: GistFileType }) => {
  const { resolvedTheme } = useTheme();
  const geoJsonData: JsonType = JSON.parse(file.content);

  return (
    <MapContainer center={[0, 0]} zoom={2} className="h-65dvh">
      <TileLayer
        url={
          resolvedTheme === 'light'
            ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png'
        }
      />
      <GeoJsonLayer data={geoJsonData} />
    </MapContainer>
  );
};
