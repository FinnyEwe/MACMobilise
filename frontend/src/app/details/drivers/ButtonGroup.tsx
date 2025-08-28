import Link from 'next/link';
import React from 'react';
import { DriverData, GeoCoderResponse, NameOption } from '@/lib/types';
import { useDriverStore, useNameOptionsStore } from '@/stores';
import { fetchCoords, fetchProfile } from '@/app/details/drivers/actions';

interface FormProps {
  maxPassengers: string;
  address: string;
  person?: NameOption;
  handleValidation: () => boolean;
  resetForm: () => void;
  addToMap: (name: string, latLong: [number, number]) => void;
}

export default function ButtonGroup({
  maxPassengers,
  address,
  person,
  handleValidation,
  resetForm,
  addToMap,
}: FormProps) {
  const setOptions = useNameOptionsStore((state) => state.setOptions);
  const setDrivers = useDriverStore((state) => state.setDriverData);

  async function handleDriverAdd() {
    const passengerNum = parseInt(maxPassengers);
    if (!handleValidation()) return;
    const geoResponse: GeoCoderResponse = await fetchCoords(address);
    console.log('done');
    if (person) {
      const newItem: DriverData = {
        address,
        name: person.value,
        passengerNum,
        url: '/default.png',
        latLong: [
          geoResponse.results[0].geometry.location.lat,
          geoResponse.results[0].geometry.location.lng,
        ],
      };
      setDrivers((prev) => [...prev, newItem]);
      resetForm();
      setOptions((prev) => prev.filter((option) => option.value !== person.value));
      addToMap(person.value, [
        geoResponse.results[0].geometry.location.lat,
        geoResponse.results[0].geometry.location.lng,
      ]);

      const imageUrl: string = (await fetchProfile(person.pageId)) ?? './default.png';
      setDrivers((prev) =>
        prev.map((d) => (d.name === person.value ? { ...d, url: imageUrl } : d)),
      );
    }
  }

  return (
    <div className="mt-5 flex gap-3">
      <Link href={'./passengers'}>
        <button className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black hover:opacity-85">
          Next
        </button>
      </Link>
      <button
        className="rounded bg-[rgb(252,211,77)] p-2 px-5 text-black hover:opacity-85"
        onClick={handleDriverAdd}
      >
        Add
      </button>
    </div>
  );
}
