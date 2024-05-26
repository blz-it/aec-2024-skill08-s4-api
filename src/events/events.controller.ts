import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { events } from './constants';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':id/subscribe')
  poll(@Res() res: Response, @Param('id') id: string) {
    const event = events.find((e) => e.name === id);
    if (!event) throw new NotFoundException('Event not found');

    const callback = (data: any) => res.json(data);
    this.eventsService.addClient({ subscribedEvent: event.name, callback });
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @Body() body: any) {
    const event = events.find((e) => e.name === id);
    if (!event) throw new NotFoundException('Event not found');

    const answer = body.answer;
    if (!answer || !['a', 'b'].includes(answer)) {
      throw new BadRequestException('Invalid answer');
    }

    this.eventsService.addVote(id, answer);
  }

  @Get(':id/vote/results')
  getVotes(@Param('id') id: string) {
    const event = events.find((e) => e.name === id);
    if (!event) throw new NotFoundException('Event not found');

    return this.eventsService.getVotes(id);
  }
}
