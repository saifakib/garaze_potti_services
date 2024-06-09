import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
dotenv.config();
export class Config {
  static readonly configService = new ConfigService();
  static readonly env = this.configService.get('ENVIRONMENT');

  static get PORT(): string {
    return this.configService.get('PORT');
  }

  static get JWT_SECRET_KEY() {
    return this.configService.get('JWT_SECRET_KEY');
  }
  static get JWT_REFRESH_SECRET() {
    return this.configService.get('JWT_REFRESH_SECRET');
  }

  static get JWT_TOKEN_EXPIRE_AT() {
    return this.configService.get('JWT_TOKEN_EXPIRE_AT');
  }
  static get JWT_REFRESH_TOKEN_EXPIRE_AT() {
    return this.configService.get('JWT_REFRESH_TOKEN_EXPIRE_AT');
  }

  //OTP
  static get OTP_STEP() {
    return this.configService.get('OTP_STEP');
  }

  // MAIL
  static get MAIL_HOST(): string {
    return this.configService.get('MAIL_HOST');
  }
  static get MAIL_PORT(): string {
    return this.configService.get('MAIL_PORT');
  }
  static get MAIL_USER(): string {
    return this.configService.get('MAIL_USER');
  }
  static get MAIL_PASSWORD(): string {
    return this.configService.get('MAIL_PASSWORD');
  }
  static get MAIL_FROM(): string {
    return this.configService.get('MAIL_FROM');
  }

  // SMS
  static get SMS_API_KEY(): string {
    return this.configService.get('SMS_API_KEY');
  }
  static get SMS_FROM(): string {
    return this.configService.get('SMS_FROM');
  }
  static get SMS_USERNAME(): string {
    return this.configService.get('SMS_USERNAME');
  }
  static get SMS_SEND_API_URL(): string {
    return this.configService.get('SMS_SEND_API_URL');
  }
}
