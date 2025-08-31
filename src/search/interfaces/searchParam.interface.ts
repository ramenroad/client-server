import { bool } from "aws-sdk/clients/signer";

interface SearchParams {
  query: string;
  userId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  inLocation?: boolean;
}

export default SearchParams;
