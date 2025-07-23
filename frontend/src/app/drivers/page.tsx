'use client';
import Stepper from '@/components/Stepper';
import { Input } from '@/components/ui/input';
import L, { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { GeoCoderResponse } from '@/lib/types';
import { useJsApiLoader } from '@react-google-maps/api';
const libraries: 'places'[] = ['places'];

export default function Home() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [input, setInput] = useState('');
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDQ5LBkKvs3Ja_50XR7F_AtphUwir1phV8'!,
    libraries,
  });
  async function initialiseGoogle() {
    const response = await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=20+Heywood+Grove,+Endeavour+Hills,+AU&key=AIzaSyDQ5LBkKvs3Ja_50XR7F_AtphUwir1phV8',
    );

    const { AutocompleteService } = (await google.maps.importLibrary(
      'places',
    )) as google.maps.PlacesLibrary;
    autocompleteServiceRef.current = new AutocompleteService();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newInput = e.target.value;

    setSearchOpen(newInput.trim().length > 0)
    setInput(newInput);
    if (autocompleteServiceRef.current) {
      let wenis = autocompleteServiceRef.current.getPlacePredictions(
        { input: newInput, componentRestrictions: { country: 'au' } },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            console.log(predictions); // ✅ Here are your predictions
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
    console.log('wenis');

    if (isLoaded){
      initialiseGoogle();
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

      <div className="mb-[2%] mt-[2%] flex gap-[15%]">
        <div className="flex flex-1 flex-col justify-center gap-3">
          {/*<div>*/}
          {/*  <span>Enter the Driver's Name</span>*/}
          {/*  <Input></Input>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <span>Enter the Maximum Passengers</span>*/}
          {/*  <Input></Input>*/}
          {/*</div>*/}
          <div className="relative">
            <span>Enter Driver's Starting Address</span>
            <Input onChange={(e) => handleChange(e)} value={input}></Input>
            {searchOpen && <div className=" w-[100%] bg-white z-10 absolute">
              wenis
            </div>}
          </div>

          <div className="flex justify-center gap-3">
            <button className="rounded bg-[rgb(252,211,77)] p-2 text-black">Next</button>
            <button className="rounded bg-[rgb(252,211,77)] p-2 text-black">Add</button>
          </div>
        </div>

        <div>
          <div id="map" className="h-[50vh] w-[35vw] rounded"></div>
        </div>
      </div>
    </main>
  );
}
