import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../app.module';

jest.mock('../messaging/producer.service');

describe('ClientService', () => {
  let app: INestApplication;
  let service: ClientService;
  let repository: Repository<Client>;
  let client: Client;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get<ClientService>(ClientService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    client = repository.create({
      name: 'Test Client',
    });
    await repository.save(client);
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('createClient', () => {
    it('should create a client', async () => {
      const newClient = await service.createClient({
        name: 'New Client',
      });

      expect(newClient).toBeDefined();
      expect(newClient.id).toBeDefined();
      expect(newClient.name).toEqual('New Client');
    });
  });

  describe('updateClient', () => {
    it('should update a client', async () => {
      const updatedClient = await service.updateClient(
        {
          name: 'Updated Client',
        },
        client.id,
      );

      expect(updatedClient).toBeDefined();
      expect(updatedClient.id).toEqual(client.id);
      expect(updatedClient.name).toEqual('Updated Client');
    });
  });

  describe('getAllPolls', () => {
    it('should return an array of clients', async () => {
      const clients = await service.getAllPolls();

      expect(clients).toBeInstancClienteOf(Array);
      expect(clients.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      await service.deleteClient(client.id);

      const deletedClient = await repository.findOneBy({ id: client.id });
      expect(deletedClient).toBeNull();
    });
  });
});
