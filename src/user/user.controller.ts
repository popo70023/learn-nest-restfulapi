import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '../entity/user';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!this.userService.findById(parseInt(id)))
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    const result = await this.userService.deleteById(parseInt(id));
    console.log(result, id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();

    console.log('讀取成功');
    return users;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(parseInt(id));
    if (!user) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    console.log('讀取成功', id);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User) {
    if (!this.userService.findById(parseInt(id)))
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    if (
      parseInt(id) != user.userId ||
      user.username === undefined ||
      user.password === undefined ||
      user.email === undefined
    )
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);

    const result = await this.userService.update(user);
    console.log(result, id, user);
  }
}
