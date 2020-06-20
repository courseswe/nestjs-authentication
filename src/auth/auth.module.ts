import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

export class AuthModule {
  static register(options: {}) {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({
          secret: 'courses',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        TypeOrmModule.forFeature([UserRepository]),
        TypeOrmModule.forRoot({
          ...options,
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
        }),
      ],
      providers: [AuthService, JwtStrategy],
      exports: [AuthService, JwtStrategy, PassportModule],
    };
  }
}
