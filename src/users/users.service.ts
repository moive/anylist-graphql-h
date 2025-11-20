import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ArrayContains, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { ErrorService } from 'src/common/error.service';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorService: ErrorService,
  ) {}
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.errorService.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    // option 1
    // return this.userRepository.find({
    //   where: {
    //     roles: ArrayContains(roles),
    //   },
    // });
    // option 2
    if (roles.length === 0)
      return this.userRepository.find({
        // No necesario cuando se usa lazy en la propiedad lastUpdateBy
        // relations: {
        //   lastUpdateBy: true,
        // },
      });
    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany(); // similate--> this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      console.log(error);
      this.errorService.handleDBErrors(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      console.error(error);
      this.errorService.handleDBErrors(`${id} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });

      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      user.lastUpdateBy = updateBy;

      return this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      this.errorService.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;

    userToBlock.lastUpdateBy = adminUser;

    return await this.userRepository.save(userToBlock);
  }
}
