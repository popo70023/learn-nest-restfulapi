import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UserService {
    private users = [
        {
          userId: 0,
          username: 'john',
          password: 'changeme',
          email: '123',
        },
        {
          userId: 1,
          username: 'maria',
          password: 'guess',
          email: '456',
        },
    ];
    indicator = 2;

    create(user:User): void {
        user.userId = this.indicator;
        this.users.push(user);
        this.indicator++;
    }

    delete(id:number): void {
        this.users = this.users.filter(user => user.userId !== id);
    }

    async read(id:number): Promise<User | undefined> {
        return Promise.resolve(this.users.find(user => user.userId === id));
    }

    async findOne(username: string): Promise<User | undefined> {
        return Promise.resolve(this.users.find(user => user.username === username));
    }

    update(updatedUser: User): void {
        const index = this.users.findIndex(user => user.userId === updatedUser.userId);
        if (index !== -1) {
            this.users[index] = updatedUser;
        }
    }

    async exists(id: number): Promise<boolean> {
        const user = await this.read(id);
        return user !== undefined;
    }
}