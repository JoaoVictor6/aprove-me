import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';

@Module({
  providers: [IntegrationsService],
  controllers: [IntegrationsController],
})
export class IntegrationsModule {}
