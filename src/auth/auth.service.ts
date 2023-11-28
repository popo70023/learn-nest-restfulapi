import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    
    return this.generateToken(user);
  }

  async generateToken(user): Promise<{ access_token: string }> {
    const payload = { userId: user.userId, username: user.username };

    return { access_token: await this.jwtService.signAsync(payload), };
  }
}
