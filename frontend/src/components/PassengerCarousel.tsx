import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { NameOption } from '@/lib/types';
import { usePassengerStore, useNameOptionsStore, useMapsStore } from '@/stores';
import L from 'leaflet';

export default function PassengerCarousel() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;
  const passengers = usePassengerStore((state) => state.passengerData);
  const setPassengers = usePassengerStore((state) => state.setPassengerData);
  const setOptions = useNameOptionsStore((state) => state.setOptions);
  const originalOptions = useNameOptionsStore((state) => state.originalOptions);
  const map = useMapsStore((state) => state.map);
  const setMarkers = useMapsStore((state) => state.setMarkers);
  const markers = useMapsStore((state) => state.markers);

  function deletePassenger(name: string) {
    setPassengers((prev) => prev.filter((p) => p.name !== name));
    const passenger = originalOptions.find((option: NameOption) => option.value === name);
    if (passenger) setOptions((prev) => [...prev, passenger]);
    setStartIndex((prev) => Math.min(prev, Math.max(passengers.length - 1 - visibleCount, 0)));

    if (map) {
      const newMarkers = markers;
      newMarkers[name].removeFrom(map);
      delete newMarkers[name];
      setMarkers(newMarkers);
    }
  }

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(passengers.length - visibleCount, 0) : prev - 1,
    );
  };

  const nextSlide = () => {
    setStartIndex((prev) => (prev + visibleCount >= passengers.length ? 0 : prev + visibleCount));
  };

  if (passengers.length === 0) return <p>No passengers added yet.</p>;

  const visiblePassengers =
    passengers.length > visibleCount
      ? Array.from(
          { length: visibleCount },
          (_, i) => passengers[(startIndex + i) % passengers.length],
        )
      : passengers;

  return (
    <div className="relative mx-auto mt-10 max-w-4xl justify-center">
      {/* Passengers Row */}
      <div className="flex flex-nowrap gap-4 overflow-hidden">
        {visiblePassengers.map((p, idx) => (
          <div
            key={p.name + idx}
            className="flex h-[190px] w-[190px] flex-col items-center rounded-2xl bg-white p-4 shadow-md transition-all duration-300"
          >
            {p.url ? (
              <div>
                <img
                  src={p.url}
                  alt={p.name}
                  className="mb-2 h-[70px] w-[70px] rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                <span className="text-sm text-gray-500">No Photo</span>
              </div>
            )}
            <h3 className="text-md block h-20 w-full truncate font-semibold leading-tight text-black">
              {p.name}
            </h3>
            <p className="block h-20 w-full truncate text-sm text-gray-500">{p.address}</p>

            {/* Delete Button */}
            <button
              onClick={() => deletePassenger(p.name)}
              className="mt-2 flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* Controls */}
      {passengers.length > visibleCount && (
        <>
          <button
            onClick={prevSlide}
            className="absolute -left-12 top-1/2 -translate-y-1/2 rounded-full bg-[rgb(252,211,77)] p-2 shadow hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5 stroke-black" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-full bg-[rgb(252,211,77)] p-2 shadow hover:bg-gray-200"
          >
            <ChevronRight className="h-5 w-5 stroke-black" />
          </button>
        </>
      )}
    </div>
  );
}
