import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { questions } from './questions';

@Injectable()
export class EventsService {
  private clients: Array<(data: any) => void> = [];
  private data: any = {};

  addClient(client: (data: any) => void) {
    this.clients.push(client);
  }

  removeClient(client: (data: any) => void) {
    this.clients = this.clients.filter((c) => c !== client);
  }

  notifyClients(data: any) {
    this.clients.forEach((c) => c(data));
    this.clients = [];
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  newEvent() {
    // Select random event type: "flashlight" or "vote"
    const eventType = Math.random() > 0.5 ? 'flashlight' : 'vote';

    if (eventType === 'flashlight') {
      this.data = { action: { type: 'flashlight' } };
    } else {
      const question = questions[Math.floor(Math.random() * questions.length)];
      this.data = { action: { type: 'vote', ...question } };
    }

    // Schedule removal of event
    setTimeout(
      () => {
        this.data = {};
      },
      // Flashlight events last 5 seconds, vote events last 15 seconds
      eventType === 'flashlight' ? 5000 : 15000,
    );

    // Send event to clients
    this.notifyClients(this.data);
  }

  // @Cron(CronExpression.EVERY_SECOND)
  // heartbeat() {
  //   console.log(new Date().toLocaleTimeString(), this.data);
  // }
}
