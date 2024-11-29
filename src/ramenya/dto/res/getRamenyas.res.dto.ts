export class getRamenyasResDTO {
  name: string;

  genre: string[];

  region: string;

  address: string;

  businessHours: {
    day: string;
    operatingTime?: string;
    breakTime?: string;
    isOpen: boolean;
  }[];
}
