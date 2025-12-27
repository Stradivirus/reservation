import { Injectable, Logger } from '@nestjs/common';
import { Sequelize, QueryTypes } from 'sequelize';
import * as crypto from 'crypto';
import { CouponResponseDto, PreregistrationType } from '../dtos/coupon.dto';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);
  private readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize('preregistration_db', 'myuser', 'mypassword', {
      host: 'db',
      dialect: 'postgres'
    });
  }

  private generateCouponCode(): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';
    const randomBytes = crypto.randomBytes(10);
    
    for (let i = 0; i < 8; i++) {
      const randomIndex = randomBytes[i] % charset.length;
      coupon += charset[randomIndex];
    }
    
    return coupon;
  }

  async generateAndValidateCoupon(): Promise<string> {
    const maxAttempts = 8;
    
    for (let i = 0; i < maxAttempts; i++) {
      const couponCode = this.generateCouponCode();
      this.logger.debug(`Generated coupon code: ${couponCode}`);
      
      const [results] = await this.sequelize.query(
        'SELECT COUNT(*) as count FROM preregistrations_preregistration WHERE coupon_code = :code',
        {
          replacements: { code: couponCode },
          type: QueryTypes.SELECT
        }
      );

      if (Number(results['count']) === 0) {
        return couponCode;
      }
    }
    
    throw new Error('유니크한 쿠폰 코드 생성 실패');
  }

  async useCoupon(couponCode: string): Promise<CouponResponseDto> {
    try {
      const [preregistration] = await this.sequelize.query(
        'SELECT * FROM preregistrations_preregistration WHERE coupon_code = :code LIMIT 1',
        {
          replacements: { code: couponCode },
          type: QueryTypes.SELECT
        }
      );

      if (!preregistration) {
        throw new Error('유효하지 않은 쿠폰 코드입니다.');
      }

      if (preregistration['is_coupon_used']) {
        throw new Error('이미 사용된 쿠폰입니다.');
      }

      await this.sequelize.query(
        'UPDATE preregistrations_preregistration SET is_coupon_used = true WHERE coupon_code = :code',
        {
          replacements: { code: couponCode },
          type: QueryTypes.UPDATE
        }
      );

      return { message: '쿠폰이 성공적으로 사용되었습니다.' };
    } catch (error) {
      this.logger.error(`Coupon use error: ${error.message}`);
      throw error;
    }
  }
}