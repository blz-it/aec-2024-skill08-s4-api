import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EventsController],
  providers: [EventsService],
})
export class AppModule {}
