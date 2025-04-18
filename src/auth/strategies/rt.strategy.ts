import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, Req } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_RT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(@Req() req: Request, payload: any) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();

    return {
      refreshToken,
      payload,
    };
  }
}
