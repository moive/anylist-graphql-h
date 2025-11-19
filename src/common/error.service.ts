import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IErrorsTypeORM } from './interfaces/error.interface';

@Injectable()
export class ErrorService {
  private logger = new Logger('UsersService');

  public handleDBErrors(error: IErrorsTypeORM | string): never {
    if (typeof error !== 'string' && error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }
    this.logger.error(error);

    throw new InternalServerErrorException(error || 'Please check server logs');
  }
}
