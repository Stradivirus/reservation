import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { RegistrationController } from './controllers/registration.controller';
import { RegistrationService } from './services/registration.service';
import { Registration } from './models/registration.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'db',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'preregistration_db',
      models: [Registration],
    }),
    SequelizeModule.forFeature([Registration]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class AppModule {}