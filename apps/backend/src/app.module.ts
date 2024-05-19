import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignorModule } from './assignor/assignor.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [AssignorModule, IntegrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
