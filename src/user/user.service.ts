import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { User } from '../entity/user';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const createdUser = this.userRepository.create(userDto);
    return this.userRepository.save(createdUser);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(updatedUser: User): Promise<UpdateResult> {
    return this.userRepository.update(updatedUser.userId, updatedUser);
  }
}
