type JwtPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

type AuthResponse =
  | { refreshToken: string; accessToken?: never; payload: JwtPayload }
  | { accessToken: string; refreshToken?: never; payload: JwtPayload };
