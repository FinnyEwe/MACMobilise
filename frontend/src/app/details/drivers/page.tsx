'use client';
import { Input } from '@/components/ui/input';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import SearchOption from '@/components/SearchOption';
import { fetchCommittee } from '@/app/details/drivers/actions';
import { NameOption } from '@/lib/types';
import { Combobox } from '@/components/Combobox';
import DriverCarousel from '@/components/DriverCarousel';

import { useMapsStore, useNameOptionsStore } from '@/stores';
import ButtonGroup from '@/app/details/drivers/ButtonGroup';

const libraries: 'places'[] = ['places'];

const customIcon = L.icon({
  iconUrl: '/marker.png', // your custom icon file
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Home() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [person, setPerson] = useState<NameOption | undefined>(undefined);
  const [number, setNumber] = useState<string>('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<boolean>(false);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const options = useNameOptionsStore((state) => state.options);
  const setOptions = useNameOptionsStore((state) => state.setOptions);
  const setOriginalOptions = useNameOptionsStore((state) => state.setOriginalOptions);
  const map = useMapsStore((state) => state.map);
  const setMarkers = useMapsStore((state) => state.setMarkers);
  const markers = useMapsStore((state) => state.markers);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    async function fetchNames() {
      const response = await fetchCommittee();
      setOptions(response);
      setOriginalOptions(response);
    }

    fetchNames();
  }, []);

  function handleValidation() {
    setAddressError(!address);
    setNumberError(!number || !parseInt(number));
    setNameError(!person);

    return !(!address || !number || !parseInt(number) || !person);
  }

  function resetForm() {
    setPerson(undefined);
    setAddress('');
    setNumber('');
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

  function addToMap(name: string, latLong: [number, number]): void {
    if (map) {
      const marker = L.marker(latLong, { icon: customIcon }).addTo(map);
      const newMarkers = markers;
      newMarkers[name] = marker;
      setMarkers(newMarkers);
      marker.bindPopup(`<b>${name}</b>`);
    }
  }

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

  return (
    <main className="flex w-[650px] flex-col">
      <div className="my-[4%]">
        <h1 className="mt-5 text-5xl font-bold">Let's start with the Drivers</h1>
      </div>

      <div className="mb-[2%] mt-[3%] flex gap-[10%]">
        <div className="item- flex flex-1 flex-col justify-center gap-3">
          <div className="relative">
            <span>Enter Driver's Starting Address</span>
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
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span>Enter the Driver's Name</span>
              <Combobox
                className={`border ${nameError ? `border-red-500 ${person ? '' : 'text-red-500'} placeholder-red-500 focus-visible:ring-red-500` : ''} `}
                value={person?.label}
                onChange={setPerson}
                options={options}
              />
            </div>

            <div className="flex flex-col">
              <span>Enter the Max Passengers</span>
              <Input
                className={`border ${numberError ? 'border-red-500 placeholder-red-500 focus-visible:ring-red-500' : ''} `}
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                placeholder={'Enter max passengers'}
              ></Input>
            </div>
          </div>

          <ButtonGroup
            maxPassengers={number}
            address={address}
            person={person}
            handleValidation={handleValidation}
            resetForm={resetForm}
            addToMap={addToMap}
          />

          <div className="ml-10 mt-4">
            <DriverCarousel />
          </div>
        </div>
      </div>
    </main>
  );
}
