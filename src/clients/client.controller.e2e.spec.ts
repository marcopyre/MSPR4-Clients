import { ProductService } from './client.service';
import { ProductDto } from './client.dto';
import { Product } from './client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;
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
          entities: [Product],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  const productDto: ProductDto = {
    name: 'Test Product',
    max: 10,
    membres: ['User 1', 'User 2'],
  };

  it('should create a product', async () => {
    const result = await service.createProduct(productDto);
    expect(result).toEqual({ id: expect.any(Number), ...productDto });
  });

  it('should update a product', async () => {
    const createdProduct = await service.createProduct(productDto);
    const updatedProductDto = { ...productDto, name: 'Updated Product' };
    const result = await service.updateProduct(
      updatedProductDto,
      createdProduct.id,
    );
    expect(result).toEqual({ id: createdProduct.id, ...updatedProductDto });
  });

  it('should get all products', async () => {
    const product1 = await service.createProduct({
      ...productDto,
      name: 'Product 1',
    });
    const product2 = await service.createProduct({
      ...productDto,
      name: 'Product 2',
    });
    const result = await service.getAllPolls();
    expect(result).toEqual([product1, product2]);
  });

  it('should delete a product', async () => {
    const createdProduct = await service.createProduct(productDto);
    await service.deleteProduct(createdProduct.id);
    const result = await repository.findOneBy({ id: createdProduct.id });
    expect(result).toBeNull();
  });
});
