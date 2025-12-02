import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }

  async executedSeed() {
    // protection
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    // cleanning database

    // Create users

    // Create items

    return true;
  }
}
