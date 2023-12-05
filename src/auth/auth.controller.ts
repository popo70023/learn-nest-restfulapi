import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async signUp(
    @Body() userDto: UserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userExists = await this.userService.findByUsername(userDto.username);
    console.log(userExists);
    if (userExists) throw new BadRequestException('User already exists');
    const newUser = await this.userService.create(userDto);

    console.log('新增成功', newUser);
    return this.authService.getTokens(newUser.userId, userDto.username);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByUsername(signInDto.username);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.password !== signInDto.password)
      throw new BadRequestException('Password is incorrect');

    console.log('登入成功');
    return this.authService.getTokens(user.userId, user.username);
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@Body() logoutDto: Record<string, any>) {
    const theUser = logoutDto.userId;

    console.log('登出成功', theUser);
    return this.authService.updateRefreshToken(theUser, '');
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Body() tokenDto: Record<string, any>) {
    const theResult = await this.authService.verifyRefreshToken(
      tokenDto.refreshToken,
    );
    if (!theResult.result)
      throw new UnauthorizedException('Refresh token verification failed');

    console.log('刷新成功', theResult);
    return this.authService.getTokens(theResult.userId, theResult.username);
  }
}
