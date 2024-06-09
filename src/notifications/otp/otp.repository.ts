import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OtpRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(otpData: Prisma.OtpsUncheckedCreateInput) {
    try {
      return await this.databaseService.otps.create({ data: otpData });
    } catch (err) {
      throw err;
    }
  }

  // async findOTP(userUuid: string, otp: string) {
  //   try {
  //     const getOtp = await this.databaseService.otps.findFirst({
  //       where: {
  //         userUuid: userUuid,
  //         code: otp,
  //         softDelete: false,
  //       },
  //       select: {
  //         id: true,
  //         uuid: true,
  //         code: true,
  //         secret: true,
  //         isUsed: true,
  //       },
  //     });
  //     return getOtp;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
