import { LatLngExpression } from 'leaflet';

export interface GeoCoderResponse {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    navigation_points: [];
    place_id: string;
  }>;
  status: string;
}

export interface DriverData {
  address: string;
  name: string;
  passengerNum: number;
  url: string;
  latLong?: LatLngExpression;
}

export interface PassengerData {
  address: string;
  name: string;
  url: string;
  latLong?: LatLngExpression;
}

export type NotionListResponse = {
  object: 'list';
  results: NotionPage[];
};

interface NotionPage {
  object: 'page';
  id: string;
  created_time: string; // ISO date string
  last_edited_time: string; // ISO date string
  created_by: Record<string, any>;
  last_edited_by: Record<string, any>;
  cover: null | Record<string, any>;
  icon: Record<string, any> | null;
  parent: Record<string, any>;
  archived: boolean;
  in_trash: boolean;
  properties: Record<string, any>; // Notion page properties are dynamic
  url: string;
  public_url: string | null;
}

export interface NameOption {
  label: string;
  value: string;
  pageId: string;
}
