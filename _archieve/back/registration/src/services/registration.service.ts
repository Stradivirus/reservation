import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Registration } from '../models/registration.model';
import { PreRegistrationDto, RegistrationResponseDto } from '../dtos/registration.dto';
import { HttpService } from '@nestjs/axios';
import * as moment from 'moment-timezone';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    @InjectModel(Registration)
    private registrationModel: typeof Registration,
    private readonly httpService: HttpService,
  ) {}

  async checkEmail(email: string): Promise<void> {
    const exists = await this.registrationModel.findOne({ where: { email } });
    if (exists) {
      throw new Error('이미 등록된 이메일 주소입니다.');
    }
  }

  async checkPhone(phone: string): Promise<void> {
    const exists = await this.registrationModel.findOne({ where: { phone } });
    if (exists) {
      throw new Error('이미 등록된 전화번호입니다.');
    }
  }

  async register(data: PreRegistrationDto): Promise<RegistrationResponseDto> {
    // 중복 체크
    await this.checkEmail(data.email);
    await this.checkPhone(data.phone);

    try {
      // 쿠폰 생성 요청
      const couponResponse = await this.httpService.axiosRef.post(
        'http://coupon:8009/coupon/generate'
      );
      const couponCode = couponResponse.data.coupon_code;

      const now = moment().tz('Asia/Seoul');

      // 등록 데이터 생성
      await this.registrationModel.create({
        email: data.email,
        phone: data.phone,
        privacy_consent: data.privacy_consent,
        created_at: now.toDate(),
        coupon_code: couponCode,
        is_coupon_used: false
      });

      // 총 등록자 수 확인
      const totalCount = await this.registrationModel.count();

      // 알림 서비스 호출
      try {
        await this.httpService.axiosRef.post(
          'http://notification:8084/notifications/milestone',
          { count: totalCount }
        );
      } catch (error) {
        this.logger.error(`Notification service error: ${error.message}`);
      }

      return {
        message: '사전 등록이 완료되었습니다.',
        created_at: now.format('YYYY-MM-DD HH:mm:ss'),
        coupon_code: couponCode
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }
}