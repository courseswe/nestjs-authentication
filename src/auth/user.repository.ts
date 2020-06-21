import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      return await user.save();
    } catch (error) {
      console.log(JSON.stringify(error));
      if (+error.code === 23505) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User already exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
    return null;
  }

  async updateUserPassword(
    username,
    authUpdatePasswordDto: AuthUpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findOne({ username });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (user.recoverToken === authUpdatePasswordDto.token) {
      user.password = await this.hashPassword(
        authUpdatePasswordDto.password,
        user.salt,
      );
      return await user.save();
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
