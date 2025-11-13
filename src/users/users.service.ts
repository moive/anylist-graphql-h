import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create(signupInput);
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong user service');
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  async block(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
