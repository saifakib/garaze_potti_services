import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Config } from '@/config/env.config';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: Config.MAIL_HOST,
        port: parseInt(Config.MAIL_PORT),
        secure: false,
        auth: {
          user: Config.MAIL_USER,
          pass: Config.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `'"Company"  <${Config.MAIL_FROM}>'`,
      },
      //   template: {
      //     dir: join(__dirname, 'templates'),
      //     adapter: new HandlebarsAdapter(),
      //     options: {
      //       strict: true,
      //     },
      //   },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
