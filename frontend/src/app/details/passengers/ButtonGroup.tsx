import Link from 'next/link';
import React from 'react';
import { PassengerData, GeoCoderResponse, NameOption } from '@/lib/types';
import { usePassengerStore, useNameOptionsStore } from '@/stores';
import { fetchCoords, fetchProfile } from '@/app/details/drivers/actions';

interface FormProps {
  address: string;
  person?: NameOption;
  handleValidation: () => boolean;
  resetForm: () => void;
  addToMap: (name: string, latLong: [number, number]) => void;
}

export default function PassengerButtonGroup({
  address,
  person,
  handleValidation,
  resetForm,
  addToMap,
}: FormProps) {
  const setOptions = useNameOptionsStore((state) => state.setOptions);
  const setPassengers = usePassengerStore((state) => state.setPassengerData);

  async function handlePassengerAdd() {
    if (!handleValidation()) return;
    const geoResponse: GeoCoderResponse = await fetchCoords(address);

    if (person) {
      const newItem: PassengerData = {
        address,
        name: person.value,
        url: '/default.png',
        latLong: [
          geoResponse.results[0].geometry.location.lat,
          geoResponse.results[0].geometry.location.lng,
        ],
      };

      setPassengers((prev) => [...prev, newItem]);

      resetForm();
      setOptions((prev) => prev.filter((option) => option.value !== person.value));

      addToMap(person.value, [
        geoResponse.results[0].geometry.location.lat,
        geoResponse.results[0].geometry.location.lng,
      ]);

      // Fetch image in background
      const imageUrl: string = (await fetchProfile(person.pageId)) ?? './default.png';
      setPassengers((prev) =>
        prev.map((p) => (p.name === person.value ? { ...p, url: imageUrl } : p)),
      );
    }
  }

  return (
    <div className="mt-5 flex gap-3">
      <Link href={'./review'}>
        <button className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black hover:opacity-85">
          Next
        </button>
      </Link>
      <button
        className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black hover:opacity-85"
        onClick={handlePassengerAdd}
      >
        Add
      </button>
    </div>
  );
}
