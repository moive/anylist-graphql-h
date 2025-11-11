import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
