import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executedSeed() {
    // protection
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    // cleanning database
    await this.deleteDatabase();

    // Create users
    const user = await this.loadUser();

    // Create items
    await this.loadItems(user);

    return true;
  }

  async deleteDatabase() {
    // delete items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // delete users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUser(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises: Promise<Item>[] = [];

    for (const item of SEED_ITEMS) {
      const createItemInput = {
        ...item,
        quantityUnits: item.quantityUnits ?? undefined,
      };
      itemsPromises.push(this.itemsService.create(createItemInput, user));
    }

    await Promise.all(itemsPromises);
  }
}
