import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CouponController } from './controllers/coupon.controller';
import { CouponService } from './services/coupon.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [CouponController],
  providers: [CouponService],
})
export class AppModule {}