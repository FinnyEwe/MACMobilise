'use client';
import Stepper from '@/components/Stepper';
import { Input } from '@/components/ui/input';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import AutocompleteService = google.maps.places.AutocompleteService;
import SearchOption from '@/components/SearchOption';
import { fetchCoords, fetchit } from '@/app/actions';
import { DriverData, GeoCoderResponse } from '@/lib/types';
const libraries: 'places'[] = ['places'];



const customIcon = L.icon({
  iconUrl: 'marker.png',   // your custom icon file
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Home() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState<string>('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<boolean>(false);
  const [driverData, setDriverData] = useState<DriverData[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  async function handleDriverAdd() {
    const passengerNum = parseInt(number);
    const newItem = { address, name, passengerNum };
    setDriverData([...driverData, newItem]);

    const geoResponse: GeoCoderResponse = await fetchCoords(address);
    if (mapRef.current !== null) {
      const marker = L.marker([
        geoResponse.results[0].geometry.location.lat,
        geoResponse.results[0].geometry.location.lng,
      ], { icon: customIcon }).addTo(mapRef.current);

      marker.bindPopup('<b>Hello world!</b><br>I am a popup.');

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

  useEffect(() => {
    const map = L.map('map').setView([-37.840935, 144.946457], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    async function fetchAutoComplete() {
      const { AutocompleteService } = (await google.maps.importLibrary(
        'places',
      )) as google.maps.PlacesLibrary;
      autocompleteServiceRef.current = new AutocompleteService()
    }

    if (isLoaded) {
      fetchAutoComplete();
    }
    return () => {
      map?.remove();
    };
  }, [isLoaded]);

  useEffect(() => {
      fetchit()
    }
  , []);

  return (
    <main className="flex flex-col px-[5%]">
      <div className="mt-[5%]">
        <div className={'flex justify-center'}>
          <Stepper id={1} />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Let's start with the Drivers</h1>
      </div>

      <div className="mb-[2%] mt-[2%] flex gap-[15%]">
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="relative">
            <span>Enter Driver's Starting Address</span>
            <Input onChange={(e) => handleChange(e)} value={address}></Input>
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
          <div>
            <span>Enter the Driver's Name</span>
            <Input onChange={(e) => setName(e.target.value)} value={name}></Input>
          </div>
          <div>
            <span>Enter the Maximum Passengers</span>
            <Input onChange={(e) => setNumber(e.target.value)} value={number}></Input>
          </div>

          <div className="flex justify-center gap-3">
            <button className="rounded bg-[rgb(252,211,77)] p-2 text-black">Next</button>
            <button
              className="rounded bg-[rgb(252,211,77)] p-2 text-black"
              onClick={handleDriverAdd}
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <div id="map" className="h-[50vh] w-[35vw] rounded"></div>
        </div>
      </div>
    </main>
  );
}
