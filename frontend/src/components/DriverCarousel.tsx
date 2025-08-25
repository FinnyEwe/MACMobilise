import { useState } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { DriverData } from '@/lib/types';

interface CarouselProps {
  drivers: DriverData[];
  onDelete: (driverName: string) => void;
}

export default function DriverCarousel({ drivers, onDelete }: CarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handleDelete = (driverName: string) => {
    onDelete(driverName);

    setStartIndex((prev) => Math.min(prev, Math.max(drivers.length - 1 - visibleCount, 0)));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(drivers.length - visibleCount, 0) : prev - 1));
  };

  const nextSlide = () => {
    setStartIndex((prev) => (prev + visibleCount >= drivers.length ? 0 : prev + 1));
  };

  if (drivers.length === 0) return <p>No drivers added yet.</p>;

  const visibleDrivers = drivers.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative mx-auto mt-10 w-full max-w-4xl justify-center">
      {/* Drivers Row */}
      <div className="flex flex-nowrap gap-4 overflow-hidden">
        {visibleDrivers.map((driver, idx) => (
          <div
            key={driver.name + `${idx}`}
            className="flex h-[190px] w-[190px] flex-col items-center rounded-2xl bg-white p-4 shadow-md transition-all duration-300"
          >
            {driver.url ? (
              <div>
                <img
                  src={driver.url}
                  alt={driver.name}
                  className="mb-2 h-[70px] w-[70px] rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                <span className="text-sm text-gray-500">No Photo</span>
              </div>
            )}
            <h3 className="text-md block h-20 w-full truncate font-semibold leading-tight text-black">
              {driver.name}
            </h3>
            <p className="text-sm text-gray-600">Max Passengers: {driver.passengerNum}</p>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(driver.name)}
              className="mt-2 flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* Controls */}
      {drivers.length > visibleCount && (
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
