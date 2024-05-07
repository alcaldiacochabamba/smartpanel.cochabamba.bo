import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      
      useFactory: (configService: ConfigService) => {
        const jwtTimeExpiration:string = configService.get('JWT_EXPIRED_TIME');
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            //expiresIn: jwtTimeExpiration,
          }
        }
      }   

    })

  ],
  exports: [TypeOrmModule,JwtStrategy, PassportModule, JwtModule]

})
export class AuthModule { }
