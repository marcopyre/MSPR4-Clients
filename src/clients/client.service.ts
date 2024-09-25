/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { ClientDto } from './client.dto';
import { ProducerService } from '../messaging/producer.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private producerService: ProducerService,
  ) {}

  async createClient(dto: ClientDto): Promise<Client> {
    const client = this.clientRepository.create(dto);
    console.log(client);
    return this.clientRepository.save(client);
  }

  async updateClient(dto: ClientDto, id: number): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id });

    const updatedClient = {
      ...dto,
      id: client.id,
    };

    return this.clientRepository.save(updatedClient);
  }

  async getAllPolls(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async deleteClient(id: number) {
    const client = await this.clientRepository.findOneBy({ id });
    this.producerService.addToMessageQueue(client.id);
    return await this.clientRepository.delete(id);
  }
}
