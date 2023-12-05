import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(
    token: string,
  ): Promise<{ userId: number; username: string; tokenType: string }> {
    return this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
  }

  async verifyRefreshToken(token: string): Promise<{
    userId: number;
    username: string;
    tokenType: string;
    result: boolean;
  }> {
    const { userId, username, tokenType } = await this.verifyToken(token);
    let result = false;

    if (tokenType == 'refresh') {
      const user = await this.userService.findById(userId);
      result = token === user.refreshToken;
    }

    return { userId, username, tokenType, result };
  }

  async getTokens(
    userId: number,
    username: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ userId, username, tokenType: 'access' }),
      this.jwtService.signAsync(
        { userId, username, tokenType: 'refresh' },
        { expiresIn: '7d' },
      ),
    ]);
    await this.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    user.refreshToken = refreshToken;
    return await this.userService.update(user);
  }
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
