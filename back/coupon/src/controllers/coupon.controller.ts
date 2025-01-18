import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CouponService } from '../services/coupon.service';
import { UseCouponDto, CouponResponseDto } from '../dtos/coupon.dto';

@Controller('coupon')
export class CouponController {
  private readonly logger = new Logger(CouponController.name);

  constructor(private readonly couponService: CouponService) {}

  @Post('generate')
  async generateCoupon(): Promise<CouponResponseDto> {
    try {
      const couponCode = await this.couponService.generateAndValidateCoupon();
      return { 
        message: '쿠폰이 생성되었습니다.',
        coupon_code: couponCode 
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('use')
  async useCoupon(@Body() useCouponDto: UseCouponDto): Promise<CouponResponseDto> {
    try {
      return await this.couponService.useCoupon(useCouponDto.coupon_code);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}