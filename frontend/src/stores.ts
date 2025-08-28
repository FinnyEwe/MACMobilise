import { create } from 'zustand';
import { DriverData, NameOption, PassengerData } from '@/lib/types';
import L from 'leaflet';

type DriversState = {
  driverData: DriverData[];
  setDriverData: (updater: DriverData[] | ((prev: DriverData[]) => DriverData[])) => void;
};

interface PassengerState {
  passengerData: PassengerData[];
  setPassengerData: (
    updater: PassengerData[] | ((prev: PassengerData[]) => PassengerData[]),
  ) => void;
}

interface MapState {
  map: L.Map | null;
  setMap: (map: L.Map) => void;
  markers: Record<string, L.Marker>;
  setMarkers: (markers: Record<string, L.Marker>) => void;
}

type NameOptionsState = {
  options: NameOption[];
  originalOptions: NameOption[];
  setOptions: (updater: NameOption[] | ((prev: NameOption[]) => NameOption[])) => void;
  setOriginalOptions: (options: NameOption[]) => void;
};

export const useDriverStore = create<DriversState>((set) => ({
  driverData: [],
  setDriverData: (updater) =>
    set((state) => ({
      driverData: typeof updater === 'function' ? updater(state.driverData) : updater,
    })),
}));

export const useNameOptionsStore = create<NameOptionsState>((set) => ({
  options: [],
  originalOptions: [],
  setOptions: (updater) =>
    set((state) => ({
      options: typeof updater === 'function' ? updater(state.options) : updater,
    })),
  setOriginalOptions: (options: NameOption[]) => set({ originalOptions: options }),
}));

export const useMapsStore = create<MapState>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
  markers: {},
  setMarkers: (markers: Record<string, L.Marker>) => set({ markers }),
}));

export const usePassengerStore = create<PassengerState>((set) => ({
  passengerData: [],
  setPassengerData: (updater) =>
    set((state) => ({
      passengerData: typeof updater === 'function' ? updater(state.passengerData) : updater,
    })),
}));
