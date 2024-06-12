import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(payload: any) {
    // const { email, subject, template, context } = payload;
    const { email, subject, context } = payload;
    console.log(context);
    try {
      const response = await this.mailerService.sendMail({
        to: email,
        subject: subject,
        //template: './' + template.toLowerCase(),
        //context: { context },
        text: context.otp,
      });
      return response;
    } catch (error: any) {
      console.log(error);
      const logger = new Logger(error.name);
      logger.error(JSON.stringify(error));
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
