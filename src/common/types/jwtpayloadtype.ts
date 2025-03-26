export type JwtPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type RtJwtPayload = {
  refreshToken: string;
  payload: JwtPayload;
};
