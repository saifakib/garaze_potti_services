import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.modules';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [MailModule, OtpModule],
  controllers: [],
  providers: [],
})
export class NotificationModule {}
