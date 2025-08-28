'use client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import SearchOption from '@/components/SearchOption';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import { useJsApiLoader } from '@react-google-maps/api';
import { Combobox } from '@/components/Combobox';
import { NameOption } from '@/lib/types';
import { useMapsStore, useNameOptionsStore } from '@/stores';
import ButtonGroup from '@/app/details/passengers/ButtonGroup';
import DriverCarousel from '@/components/DriverCarousel';
import PassengerCarousel from '@/components/PassengerCarousel';

const libraries: 'places'[] = ['places'];

const customIcon = L.icon({
  iconUrl: '/marker.png', // your custom icon file
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
export default function Home() {
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [nameError, setNameError] = useState<boolean>(false);
  const [person, setPerson] = useState<NameOption | undefined>(undefined);
  const [addressError, setAddressError] = useState<boolean>(false);
  const options = useNameOptionsStore((state) => state.options);
  const map = useMapsStore((state) => state.map);
  const setMarkers = useMapsStore((state) => state.setMarkers);
  const markers = useMapsStore((state) => state.markers);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    async function fetchAutoComplete() {
      const { AutocompleteService } = (await google.maps.importLibrary(
        'places',
      )) as google.maps.PlacesLibrary;
      autocompleteServiceRef.current = new AutocompleteService();
    }

    if (isLoaded) {
      fetchAutoComplete();
    }
  }, [isLoaded]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newInput = e.target.value;

    setSearchOpen(newInput.trim().length > 0);
    setAddress(newInput);

    if (autocompleteServiceRef.current) {
      await autocompleteServiceRef.current.getPlacePredictions(
        { input: newInput, componentRestrictions: { country: 'au' } },
        (predictionsResponse, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictionsResponse) {
            setPredictions(predictionsResponse);
          } else {
            console.log('No predictions or error:', status);
          }
        },
      );
    }
  }

  function handleClick(prediction: AutocompletePrediction) {
    setSearchOpen(false);
    let query = '';
    const terms = prediction.terms;
    for (const term of terms) {
      query += `+${term['value']}`;
    }

    setAddress(prediction.description);
  }

  function addToMap(name: string, latLong: [number, number]): void {
    if (map) {
      const marker = L.marker(latLong, { icon: customIcon }).addTo(map);
      const newMarkers = markers;
      newMarkers[name] = marker;
      setMarkers(newMarkers);
      marker.bindPopup(`<b>${name}</b>`);
    }
  }

  function handleValidation() {
    setAddressError(!address);
    setNameError(!person);

    return !!address && !!person; // only require address and name
  }

  function resetForm() {
    setPerson(undefined);
    setAddress('');
  }

  return (
    <main className="flex w-[650px] flex-col">
      <div className="my-[4%]">
        <h1 className="mt-5 text-5xl font-bold">Passenger Information</h1>
        <div className="mb-[2%] mt-[4%]">
          <div className="relative">
            <span>Enter Passenger's Pickup Address</span>
            <Input
              className={`border ${addressError ? 'border-red-500 placeholder-red-500 focus-visible:ring-red-500' : 'border-gray-300'} `}
              onChange={(e) => handleChange(e)}
              value={address}
              placeholder={'Enter Driver Address'}
            ></Input>
            {searchOpen && (
              <div className="absolute z-10 w-[100%] rounded bg-white p-2 text-black">
                {predictions &&
                  predictions.map((prediction, index) => (
                    <SearchOption
                      key={index}
                      option={prediction.description}
                      onClick={() => handleClick(prediction)}
                    ></SearchOption>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col">
            <span>Enter the Passenger's Name</span>
            <Combobox
              className={`border ${nameError ? `border-red-500 ${person ? '' : 'text-red-500'} placeholder-red-500 focus-visible:ring-red-500` : ''} `}
              value={person?.label}
              onChange={setPerson}
              options={options}
            />
          </div>

          <ButtonGroup
            address={address}
            person={person}
            handleValidation={handleValidation}
            resetForm={resetForm}
            addToMap={addToMap}
          />

          <div className="ml-10 mt-4">
            <PassengerCarousel />
          </div>
        </div>
      </div>
    </main>
  );
}
