'use client';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMapsStore } from '@/stores';

export default function MapContainer() {
  const mapRef = useRef<L.Map | null>(null);
  const map = useMapsStore((state) => state.map);
  const setMap = useMapsStore((state) => state.setMap);
  useEffect(() => {
    if (!map && !mapRef.current) {
      const newMap = L.map('map').setView([-37.840935, 144.946457], 9);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(newMap);

      mapRef.current = newMap;
      setMap(newMap);
      console.log('map', mapRef);
    } else if (map) {
      mapRef.current = map;
    }
  }, [map, setMap]);

  return <div id="map" className="h-[60vh] w-[45vw] rounded"></div>;
}
