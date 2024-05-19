import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  private clients: Array<(data: any) => void> = [];
  private data: Array<any> = [];

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
}
