'use client';
import Stepper from '@/components/Stepper';
import { Input } from '@/components/ui/input';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import SearchOption from '@/components/SearchOption';
import { fetchCommittee, fetchCoords, fetchProfile } from '@/app/actions';
import { DriverData, GeoCoderResponse, NameOption } from '@/lib/types';
import { Combobox } from '@/components/Combobox';
import DriverCarousel from '@/components/DriverCarousel';
import defaultImage from '@/public/default.png';

const libraries: 'places'[] = ['places'];

const customIcon = L.icon({
  iconUrl: 'marker.png', // your custom icon file
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
let originalOptions: NameOption[] = [];

export default function Home() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [address, setAddress] = useState('');
  const [person, setPerson] = useState<NameOption | undefined>(undefined);
  const [number, setNumber] = useState<string>('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<boolean>(false);
  const [driverData, setDriverData] = useState<DriverData[]>([]);
  const [options, setOptions] = useState<NameOption[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    async function fetchNames() {
      const response = await fetchCommittee();
      setOptions(response);

      originalOptions = response;
      console.log('originalOptions', originalOptions);
    }

    fetchNames();
  }, []);

  function handleValidation() {
    setAddressError(!address);
    setNumberError(!number || !parseInt(number));
    setNameError(!person);

    return !(!address || !number || !parseInt(number) || !person);
  }

  async function handleDriverAdd() {
    const passengerNum = parseInt(number);
    if (!handleValidation()) return;
    if (person) {
      const newItem = {
        address,
        name: person?.value,
        passengerNum,
        url: '/default.png',
      };

      setPerson(undefined);
      setAddress('');
      setNumber('');

      setOptions(options.filter((option) => option.value !== person.value));
      setDriverData([...driverData, newItem]);
      const imageUrl: string = (await fetchProfile(person.pageId)) ?? '/default.png';
      setDriverData((prev) =>
        prev.map((d) => (d.name === person?.value ? { ...d, url: imageUrl } : d)),
      );
    }
    const geoResponse: GeoCoderResponse = await fetchCoords(address);
    if (mapRef.current !== null) {
      const marker = L.marker(
        [
          geoResponse.results[0].geometry.location.lat,
          geoResponse.results[0].geometry.location.lng,
        ],
        { icon: customIcon },
      ).addTo(mapRef.current);

      marker.bindPopup('<b>Hello world!</b><br>I am a popup.');
    }
  }

  function deleteDriver(name: string) {
    setDriverData((prev) => prev.filter((driver) => driver.name !== name));
    const driver = originalOptions.find((option) => option.value === name);
    console.log('driver', driver);
    if (driver) {
      const newOptions = [...options, driver];
      setOptions(newOptions);
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
      autocompleteServiceRef.current = new AutocompleteService();
    }

    if (isLoaded) {
      fetchAutoComplete();
    }
    return () => {
      map?.remove();
    };
  }, [isLoaded]);

  return (
    <main className="flex flex-col px-[5%]">
      <div className="mt-[5%]">
        <div className={'flex justify-center'}>
          <Stepper id={1} />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Let's start with the Drivers</h1>
      </div>

      <div className="mb-[2%] mt-[2%] flex gap-[10%]">
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

          <div className="mt-5 flex gap-3">
            <button className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black">Next</button>
            <button
              className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black"
              onClick={handleDriverAdd}
            >
              Add
            </button>
          </div>

          <div className="ml-10">
            <DriverCarousel drivers={driverData} onDelete={deleteDriver} />
          </div>
        </div>
        <div>
          <div id="map" className="h-[60vh] w-[45vw] rounded"></div>
        </div>
      </div>
    </main>
  );
}
