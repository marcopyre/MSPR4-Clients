import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  public httpRequestCounter: Counter<string>;

  constructor() {
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'status', 'endpoint'],
    });
  }
}
