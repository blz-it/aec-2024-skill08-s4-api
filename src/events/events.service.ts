import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private clients: Array<(data: any) => void> = [];
  private data: any = { action: null };

  constructor() {
    this.scheduleNewAction();
  }

  addClient(client: (data: any) => void) {
    this.clients.push(client);
  }

  removeClient(client: (data: any) => void) {
    this.clients = this.clients.filter((c) => c !== client);
  }

  notifyClients() {
    this.clients.forEach((c) => c(this.data));
    this.clients = [];
  }

  scheduleNewAction() {
    const actions = ['flashlight', 'vote'];
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];
    const delay = Math.floor(Math.random() * 15000) + 5000; // 5-20 seconds

    setTimeout(() => {
      this.data = { action: selectedAction };
      this.notifyClients();

      setTimeout(
        () => {
          this.data = { action: null };
          this.notifyClients();
          this.scheduleNewAction();
        },
        selectedAction === 'flashlight' ? 5000 : 15000,
      );
    }, delay);
  }

  getCurrentAction() {
    if (Object.keys(this.data).length > 0) return this.data;
    return { action: null };
  }
}
