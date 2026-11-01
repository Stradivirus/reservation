import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}