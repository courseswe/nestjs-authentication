import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Param,
  Patch,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() response,
  ): Promise<User> {
    try {
      let user = await this.authService.signUp(authCredentialsDto);
      return response.status(HttpStatus.CREATED).json(plainToClass(User, user));
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('signin')
  signin(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('recover-password/:username')
  recoverPassword(@Param('username') username) {
    return this.authService.recoverPassword(username);
  }

  @Patch('password')
  updateUserPassword(
    @Body(ValidationPipe) authUpdatePasswordDto: AuthUpdatePasswordDto,
  ) {
    return this.authService.updateUserPassword(authUpdatePasswordDto);
  }
}
