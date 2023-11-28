import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() user:User): void {
        if(user.username === undefined || user.password === undefined || user.email === undefined) {
            throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
        }

        this.userService.create(user);
        console.log('新增成功', user);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string): void {
        if(!this.userService.exists(parseInt(id))) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        this.userService.delete(parseInt(id));
        console.log('刪除成功', id);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    read(@Param('id') id: string): Promise<User> {
        let user = this.userService.read(parseInt(id))

        if(user === undefined) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        console.log('讀取成功', id);
        return user;
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() user:User): void {
        if(!this.userService.exists(parseInt(id))) {
            throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
        }
        if(parseInt(id) != user.userId || user.username === undefined || user.password === undefined || user.email === undefined) {
            throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
        }

        this.userService.update(user);
        console.log('更改成功', id, user);
    }
}
