export interface ListingInterface {
  bathroom: number;
  id: string;
  bedrooms: number;
  discountedPrice?: number;
  furnished: boolean;
  geolocation: { lng: number; lat: number };
  imageUrls: any;
  imgUrls?: string[];
  location?: any;
  locationPositionStack?: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  userRef?: string;
  type: string;
  timeStamp?: any;
}

export interface ListingInterfaceData {
  data: ListingInterface;
  id: string;
}

export interface DocumentData {
  bathrooms: number;
  bedrooms: number;
  discountedPrice: number;
  furnished: boolean;
  geolocation: { lat: number; lng: number };
  imageUrls: string[];
  locationPositionStack: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  timestamp?: any;
  type: string;
  userRef: string;
}
export interface DocumentData {
  bathrooms: number;
  bedrooms: number;
  discountedPrice: number;
  furnished: boolean;
  geolocation: { lat: number; lng: number };
  imgUrls: string[];
  locationPositionStack: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  timestamp?: any;
  type: string;
  userRef: string;
}

export interface DocumentDataEdit {
  bathrooms: number;
  bedrooms: number;
  discountedPrice?: number;
  furnished: boolean;
  geolocation: { lat: number; lng: number };
  imgUrls?: any;
  locationPositionStack?: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  timestamp?: any;
  type: string;
  userRef: string;
}
