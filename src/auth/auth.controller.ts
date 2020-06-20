import { AuthUpdatePasswordDto } from './dto/auth-update-password.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
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
