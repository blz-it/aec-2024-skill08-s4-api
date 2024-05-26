import { Injectable } from '@nestjs/common';
import { events, questions } from './constants';

interface Client {
  subscribedEvent: string;
  callback: (data: any) => void;
}

export interface Vote {
  answer: 'a' | 'b';
  createdAt: Date;
}

@Injectable()
export class EventsService {
  private clients: Client[] = [];
  private votes: Record<string, Vote[]> = events.reduce(
    (acc, event) => ({ ...acc, [event.name]: [] }),
    {},
  );

  constructor() {
    events.forEach((event) => this.scheduleNewAction(event.name));
  }

  addClient(client: Client) {
    this.clients.push(client);
  }

  notifyClients(event: string, action: any) {
    // Notify all clients subscribed to the event
    this.clients
      .filter((client) => client.subscribedEvent === event)
      .forEach((client) => client.callback(action));

    // Remove clients subscribed to the event
    this.clients = this.clients.filter(
      (client) => client.subscribedEvent !== event,
    );
  }

  scheduleNewAction(event: string) {
    const availableActions = events.find(
      (e) => e.name === event,
    ).availableActions;
    const selectedAction =
      availableActions[Math.floor(Math.random() * availableActions.length)];
    const delay = Math.floor(Math.random() * 15000) + 15000; // 15-30 seconds

    setTimeout(() => {
      if (selectedAction === 'flashlight') {
        this.notifyClients(event, { action: { type: 'flashlight' } });
      } else if (selectedAction === 'vote') {
        const question =
          questions[Math.floor(Math.random() * questions.length)];
        this.notifyClients(event, { action: { type: 'vote', ...question } });
      }

      setTimeout(
        () => {
          this.notifyClients(event, { action: null });
          this.scheduleNewAction(event);
        },
        selectedAction === 'flashlight' ? 5000 : 15000,
      );
    }, delay);
  }

  addVote(event: string, answer: 'a' | 'b') {
    this.votes[event].push({ answer, createdAt: new Date() });
  }

  getVotes(event: string) {
    return this.votes[event];
  }
}
