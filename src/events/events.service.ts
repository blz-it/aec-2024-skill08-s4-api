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
  private currentActions: Record<string, any> = events.reduce(
    (acc, event) => ({ ...acc, [event.name]: { action: null } }),
    {},
  );
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

  notifyClients(event: string) {
    // Notify all clients subscribed to the event
    this.clients
      .filter((client) => client.subscribedEvent === event)
      .forEach((client) => client.callback(this.currentActions[event]));

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
        this.currentActions[event] = { action: { type: 'flashlight' } };
      } else if (selectedAction === 'vote') {
        const question =
          questions[Math.floor(Math.random() * questions.length)];
        this.currentActions[event] = { action: { type: 'vote', ...question } };
      }

      this.notifyClients(event);

      setTimeout(
        () => {
          this.currentActions[event] = { action: null };
          this.notifyClients(event);
          this.scheduleNewAction(event);
        },
        selectedAction === 'flashlight' ? 5000 : 15000,
      );
    }, delay);
  }

  getCurrentAction(event: string) {
    return this.currentActions[event];
  }

  addVote(event: string, answer: 'a' | 'b') {
    this.votes[event].push({ answer, createdAt: new Date() });
  }

  getVotes(event: string) {
    return this.votes[event];
  }
}
