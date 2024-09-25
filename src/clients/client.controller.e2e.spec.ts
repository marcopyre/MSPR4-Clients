import { ClientService } from './client.service';
import { ClientDto } from './client.dto';
import { Client } from './client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ProducerService } from '../messaging/producer.service';
dotenv.config();

describe('ClientService', () => {
  let service: ClientService;
  let repository: Repository<Client>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DBHOST,
          port: 5432,
          username: process.env.DBUSER,
          password: process.env.DBPASS,
          database: process.env.DBNAME,
          entities: [Client],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Client]),
      ],
      providers: [ClientService, ProducerService],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  const clientDto: ClientDto = {
    name: 'Test Client',
  };

  it('should create a client', async () => {
    const result = await service.createClient(clientDto);
    expect(result).toEqual({ id: expect.any(Number), ...clientDto });
  });

  it('should update a client', async () => {
    const createdClient = await service.createClient(clientDto);
    const updatedClientDto = { ...clientDto, name: 'Updated Client' };
    const result = await service.updateClient(
      updatedClientDto,
      createdClient.id,
    );
    expect(result).toEqual({ id: createdClient.id, ...updatedClientDto });
  });

  it('should get all clients', async () => {
    const client1 = await service.createClient({
      ...clientDto,
      name: 'Client 1',
    });
    const client2 = await service.createClient({
      ...clientDto,
      name: 'Client 2',
    });
    const result = await service.getAllPolls();
    expect(result).toEqual([client1, client2]);
  });

  it('should delete a client', async () => {
    const createdClient = await service.createClient(clientDto);
    await service.deleteClient(createdClient.id);
    const result = await repository.findOneBy({ id: createdClient.id });
    expect(result).toBeNull();
  });
});
