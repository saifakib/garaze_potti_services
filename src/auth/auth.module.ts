import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/users/users.repository';
import { RolesRepository } from '@/access-control/roles/roles.repository';
import { NotificationModule } from '@/notifications/notifications.module';
import { OtpService } from '@/notifications/otp/otp.service';
import { OtpRepository } from '@/notifications/otp/otp.repository';
import { MailService } from '@/notifications/mail/mail.service';
import { SmsService } from '@/notifications/sms/sms.service';
@Module({
  imports: [NotificationModule, NotificationModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RolesRepository, OtpService, OtpRepository, MailService, SmsService],
})
export class AuthModule {}
