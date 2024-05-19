import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

ConfigModule.forRoot();
@Module({
  providers: [IntegrationsService],
  controllers: [IntegrationsController],
  imports: [
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
})
export class IntegrationsModule {}
