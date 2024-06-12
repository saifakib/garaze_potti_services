import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { UserRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto, LoginDto, RefreshTokenDto } from '../validationSchema/auth';
import { randomCode } from '@/utils/random-code.util';
import { Badge, Roles, SIGNUP_METHOD, UserType } from '@prisma/client';
import { Config } from '@/config/env.config';
import { RolesRepository } from '@/access-control/roles/roles.repository';
import { OtpService } from '@/notifications/otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly otpService: OtpService,
  ) {}

  _generateUserUniqueId(): string {
    return `${randomCode(10)}`;
  }

  async signup(data: SignUpDto) {
    const { email, mobile, password, userType, signUpMethod } = data;
    try {
      const role = await this.isRoleExist(userType);

      // Check for existing user based on signup method
      const searchCriteria = signUpMethod === 'EMAIL' ? { email } : { mobile };
      const isUserExits = await this.userRepository.findOne(searchCriteria);
      if (isUserExits) {
        throw new HttpException('User already exits!!', HttpStatus.BAD_REQUEST);
      }

      // Create user with appropriate properties
      const createUser: any = await this.userRepository.create({
        ...(email && { email }),
        ...(mobile && { mobile }),
        password: hashSync(password, 10),
        userType: userType,
        badge: Badge.FLYING,
        signupMethod: signUpMethod === 'EMAIL' ? SIGNUP_METHOD.EMAIL : SIGNUP_METHOD.MOBILE,
        profile: { create: {} },
        role: {
          connect: {
            uuid: role.uuid,
          },
        },
      });
      //const { accessToken, refreshToken } = await this.getTokens(createUser);
      delete createUser.password;
      delete createUser.role;
      await this.otpService.sendOtp(createUser.uuid, signUpMethod, email, mobile);
      return {
        user: createUser,
        // tokens: {
        //   accessToken,
        //   refreshToken,
        // },
      };
    } catch (err) {
      throw err;
    }
  }

  async login(data: LoginDto) {
    const { email, mobile, password } = data;
    try {
      const searchCriteria = email ? { email } : { mobile };
      const user = await this.userRepository.findOne(searchCriteria);
      if (!user) {
        throw new HttpException('Invalid Credentials!!', HttpStatus.BAD_REQUEST);
      }

      // is password match
      const isPasswordMatch = compareSync(password, user.password);
      if (!isPasswordMatch) {
        throw new HttpException('Invalid Credentials password!!', HttpStatus.BAD_REQUEST);
      }
      delete user.password;
      const { accessToken, refreshToken } = await this.getTokens(user);
      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async refreshToken(data: RefreshTokenDto) {
    try {
      /// Verifying the refresh token
      const decodedRefreshToken = await this.jwtService.verifyAsync(data.refreshToken, {
        secret: Config.JWT_REFRESH_SECRET,
      });
      // Extract user information from the decoded refresh token
      const { sub: uuid } = decodedRefreshToken;
      const user = await this.userRepository.findOne({ uuid: uuid });
      if (!user) {
        throw new HttpException('Invalid RefreshToken', HttpStatus.FORBIDDEN);
      }
      // Generate a new access token for the user
      const { accessToken, refreshToken } = await this.getTokens(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.uuid,
          ...payload,
        },
        {
          secret: Config.JWT_SECRET_KEY,
          expiresIn: Config.JWT_TOKEN_EXPIRE_AT,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.uuid,
        },
        {
          secret: Config.JWT_REFRESH_SECRET,
          expiresIn: Config.JWT_REFRESH_TOKEN_EXPIRE_AT,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async isRoleExist(userType: UserType) {
    const typesToRole = {
      END_USER: 'CONSUMER',
      SERVICE_PROVIDER: 'PROVIDER',
    };
    try {
      const roleArgs: Record<string, any> = {};
      Object.assign(roleArgs, { name: typesToRole[userType] });
      const role: Roles = await this.rolesRepository.find(roleArgs);
      if (!role) throw new NotFoundException('Invalid role');
      return role;
    } catch (error) {
      throw error;
    }
  }
}
