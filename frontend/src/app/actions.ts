import AutocompleteService = google.maps.places.AutocompleteService;

export async function initialiseGoogle(): Promise<AutocompleteService> {
  const { AutocompleteService } = (await google.maps.importLibrary(
    'places',
  )) as google.maps.PlacesLibrary;
  return new AutocompleteService();
}

export async function fetchCoords(address: string){
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+AU&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  console.log(await response.json())
}

