import { Controller, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { RegistrationService } from '../services/registration.service';
import { PreRegistrationDto, EmailCheckDto, PhoneCheckDto, RegistrationResponseDto } from '../dtos/registration.dto';

@Controller('api')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post('check-email')
  async checkEmail(@Body() emailCheckDto: EmailCheckDto) {
    try {
      await this.registrationService.checkEmail(emailCheckDto.email);
      return { message: '사용 가능한 이메일 주소입니다.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('check-phone')
  async checkPhone(@Body() phoneCheckDto: PhoneCheckDto) {
    try {
      await this.registrationService.checkPhone(phoneCheckDto.phone);
      return { message: '사용 가능한 전화번호입니다.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('preregister')
  async preregister(@Body() preRegistrationDto: PreRegistrationDto): Promise<RegistrationResponseDto> {
    try {
      return await this.registrationService.register(preRegistrationDto);
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException('이메일 또는 전화번호가 이미 등록되어 있습니다.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}