'use client';
import Stepper from '@/components/Stepper';
import { Input } from '@/components/ui/input';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import SearchOption from '@/components/SearchOption';
import {fetchCoords, initialiseGoogle} from '@/app/actions';
const libraries: 'places'[] = ['places'];

export default function Home() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });



  function handleClick(prediction: AutocompletePrediction){
    setSearchOpen(false)
    let query = ""
    const terms = prediction.terms
        for (const term of terms){
          query += `+${term["value"]}`
        }
    fetchCoords(query)
    setInput(prediction.description)
  }
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newInput = e.target.value;

    setSearchOpen(newInput.trim().length > 0);
    setInput(newInput);
    if (autocompleteServiceRef.current) {
      let wenis = autocompleteServiceRef.current.getPlacePredictions(
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


    async function fetchAutoComplete() {
      autocompleteServiceRef.current = await initialiseGoogle();
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

      <div className="mb-[2%] mt-[2%] flex gap-[15%]">
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="relative">
            <span>Enter Driver's Starting Address</span>
            <Input onChange={(e) => handleChange(e)} value={input}></Input>
            {searchOpen && (
              <div className="absolute z-10 w-[100%] rounded bg-white p-2 text-black">
                {predictions &&
                  predictions.map((prediction, index) => (
                    <SearchOption key={index} option={prediction.description} onClick={()=>handleClick(prediction)}></SearchOption>
                  ))}
              </div>
            )}
          </div>
          <div>
            <span>Enter the Driver's Name</span>
            <Input></Input>
          </div>
          <div>
            <span>Enter the Maximum Passengers</span>
            <Input></Input>
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
