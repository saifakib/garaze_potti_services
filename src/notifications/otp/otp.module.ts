import { Module } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';

@Module({
  controllers: [],
  providers: [OtpService, OtpRepository, MailService, SmsService],
})
export class OtpModule {}
