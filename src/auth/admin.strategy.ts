import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  username: string;
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'isAdmin') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.username);

    if (!user || user.isAdmin !== true) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
