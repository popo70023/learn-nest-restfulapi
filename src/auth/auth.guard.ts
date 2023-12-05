import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { extractTokenFromHeader } from './auth.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
  [x: string]: any;
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token not provided');
    try {
      const payload = await this.jwtService.verifyAsync<{
        userId: number;
        username: string;
        tokenType: string;
      }>(token, { secret: jwtConstants.secret });
      if (payload.tokenType != 'access')
        throw new UnauthorizedException('Invalid token type');
    } catch {
      throw new UnauthorizedException('Token verification failed');
    }
    return true;
  }
}
