import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CommonModule } from 'src/common/common.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), CommonModule, ItemsModule],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
