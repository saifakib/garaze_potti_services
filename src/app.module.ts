import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Config } from '@/config/env.config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { AccessControlModule } from './access-control/ccess-control.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: Config.JWT_SECRET_KEY,
      signOptions: { expiresIn: Config.JWT_TOKEN_EXPIRE_AT },
    }),
    DatabaseModule,
    AuthModule,
    AccessControlModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggerInterceptor,
    // },
  ],
})
export class AppModule {}
