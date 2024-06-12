import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { OtpRepository } from './otp.repository';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  async createOtp(userUuid: string) {
    try {
      const otp_secret: string = authenticator.generateSecret();
      const otp = authenticator.generate(otp_secret);

      const createOtpInput: Prisma.OtpsUncheckedCreateInput = {
        userUuid,
        otp,
        secret: otp_secret,
      };
      const newOTP = await this.otpRepository.create(createOtpInput);
      return newOTP;
    } catch (err) {
      throw err;
    }
  }

  async sendOtp(userUuid: string, send: string | null, email: string | null, mobile: string | null) {
    try {
      const otpResponse: any = await this.createOtp(userUuid);

      const emailData = {
        email,
        subject: 'One Time Password',
        template: 'OTP',
        context: {
          otp: otpResponse.otp,
        },
      };
      const smsData = {
        mobile,
        text: otpResponse.otp,
      };

      switch (send) {
        case 'EMAIL':
          this.mailService.sendEmail(emailData);
          break;
        case 'MOBILE':
          this.smsService.sendSms(smsData);
          break;
        case 'BOTH':
          this.mailService.sendEmail(emailData);
          this.smsService.sendSms(smsData);
          break;
        default:
          throw new Error('No email or mobile provided');
      }
    } catch (err) {
      throw err;
    }
  }
}
