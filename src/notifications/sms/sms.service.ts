import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Config } from '@/config/env.config';
import { sendRequest } from '@/utils/sendRequest';
const { SMS_SEND_API_URL, SMS_API_KEY, SMS_USERNAME, SMS_FROM } = Config;

@Injectable()
export class SmsService {
  async sendSms(sendSmsData: any) {
    // Remove leading '+' if present
    sendSmsData.mobile = sendSmsData.mobile.startsWith('+') ? sendSmsData.mobile.substring(1) : sendSmsData.mobile;
    try {
      const bodyData: any = {
        UserName: `${SMS_USERNAME}`,
        Apikey: `${SMS_API_KEY}`,
        MobileNumber: sendSmsData.mobile,
        CampaignId: 'null',
        SenderName: `${SMS_FROM}`,
        TransactionType: 'T',
        Message: sendSmsData.text,
      };
      console.log(bodyData);
      const response = await sendRequest(SMS_SEND_API_URL, {
        method: 'POST',
        body: JSON.stringify(bodyData),
      });
      console.log(response);
      return response;
    } catch (error: any) {
      const logger = new Logger(error.name);
      logger.error(JSON.stringify(error));
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
