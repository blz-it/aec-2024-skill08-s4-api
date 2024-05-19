import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/subscribe')
  poll(@Req() req: Request, @Res() res: Response) {
    const client = (data: any) => res.json(data);
    this.eventsService.addClient(client);
    req.on('close', () => this.eventsService.removeClient(client));
  }

  // @Post(':id')
  // simulateEvent(@Body() body: any) {
  //   this.eventsService.notifyClients(body);
  // }
}
