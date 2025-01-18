import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  private readonly milestoneCount = 10;

  async sendMilestoneNotification(count: number) {
    try {
      if (count % this.milestoneCount !== 0) {
        return;
      }

      this.logger.log(`Sending notification for milestone: ${count} registrations`);

      await axios.post(this.slackWebhookUrl, {
        text: `🎉 축하합니다! 사전 등록자 수 ${count}명을 달성했습니다! 🎉`
      });

      this.logger.log('Slack notification sent successfully');
    } catch (error) {
      this.logger.error(`Failed to send Slack notification: ${error.message}`);
      throw error;
    }
  }
}