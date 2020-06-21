import { User } from './user.entity';
import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return await this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async recoverPassword(username) {
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const recoverToken = await this.jwtService.sign({ username });
    user.recoverToken = recoverToken;
    await user.save();
    return recoverToken;
  }

  async updateUserPassword(authUpdatePasswordDto: AuthUpdatePasswordDto) {
    let { username } = await this.jwtService.verify(
      authUpdatePasswordDto.token,
    );
    return await this.userRepository.updateUserPassword(
      username,
      authUpdatePasswordDto,
    );
  }
}
