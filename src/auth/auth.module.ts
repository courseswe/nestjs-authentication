import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
// import * as config from 'config';

@Module({
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
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'courses',
      synchronize: true,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
    }),
  ],
})
export class AuthModule {
  static register(options?) {
    return {
      // Dynamic modules must return an object with the exact same interface, plus one additional property called module.
      // The module property serves as the name of the module, and should be the same as the class name of the module,
      // as shown in the example below.
      module: AuthModule,
      providers: [
        {
          provide: AuthService,
          //useValue: new EasyconfigService(options),
        },
      ],
      exports: [AuthService, JwtStrategy, PassportModule],
    };
  }
}
