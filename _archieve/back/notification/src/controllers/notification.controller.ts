import { Controller, Post, Body, Logger } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationDto } from '../dtos/notification.dto';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Post('milestone')
  async sendMilestoneNotification(@Body() dto: NotificationDto) {
    this.logger.log(`Received milestone notification request for count: ${dto.count}`);
    await this.notificationService.sendMilestoneNotification(dto.count);
    return { message: 'Notification sent successfully' };
  }
}