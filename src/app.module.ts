import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from './helpers/helpers.module';
import { RoutesModule } from './routes/routes.module';
import { PanelsModule } from './panels/panels.module';
import { MessagesModule } from './messages/messages.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LanesModule } from './lanes/lanes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HandlerModule } from './handler/handler.module';
import { IsUnique } from './validations/is-unique.validator';
import { WebsocketsModule } from './websockets/websockets.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { KeycloakService } from './config/keycloak.service';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakConfigModule } from './config/config.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Ruta a tu directorio de archivos estáticos
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      cache: false
    }),
    ScheduleModule.forRoot(),
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakService,
      imports: [KeycloakConfigModule]
    }),
    HelpersModule,
    RoutesModule,
    PanelsModule,
    MessagesModule,
    LanesModule,
    HandlerModule,
    WebsocketsModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    IsUnique,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule { }
