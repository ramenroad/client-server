export class getRamenyaByIdResDTO {
  name: string;

  genre: string;

  region: string;

  address: string;

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
