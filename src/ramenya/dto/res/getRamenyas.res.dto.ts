export class getRamenyasResDTO {
  name: string;

  genre: string;

  region: string;

  address: string;

  latitude: number;

  longitude: number;

  contactNumber?: string;

  instagramProfile?: string;

  businessHours: {
    day: string;
    operatingTime?: string;
    breakTime?: string;
    isOpen: boolean;
  }[];

  recommendedMenu?: {
    name: string;
  }[];

  isSelfmadeNoodle: boolean;
}
