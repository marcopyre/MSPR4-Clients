import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './client.service';
import { Product } from './client.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { ProducerService } from 'src/messaging/producer.service';
import { MetricsService } from 'src/metrics/metrics.service';
import { UsersService } from 'src/users/users.service';
import { ProductController } from './client.controller';
import { AppController } from 'src/app.controller';
import { UserController } from 'src/users/users.controller';
import { AuthModule } from 'src/auth/auth.module';

describe('ProductService', () => {
  let app: INestApplication;
  let service: ProductService;
  let repository: Repository<Product>;
  let product: Product;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ProducerService],
      providers: [
        ProductService,
        UsersService,
        MetricsService,
        ProducerService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
      controllers: [ProductController, AppController, UserController],
    }).compile();

    app = module.createNestApplication();
    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    product = repository.create({
      name: 'Test Product',
    });
    await repository.save(product);
  });

  afterEach(async () => {
    await repository.clear();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const newProduct = await service.createProduct({
        name: 'New Product',
      });

      expect(newProduct).toBeDefined();
      expect(newProduct.id).toBeDefined();
      expect(newProduct.name).toEqual('New Product');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updatedProduct = await service.updateProduct(
        {
          name: 'Updated Product',
        },
        product.id,
      );

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.id).toEqual(product.id);
      expect(updatedProduct.name).toEqual('Updated Product');
    });
  });

  describe('getAllPolls', () => {
    it('should return an array of products', async () => {
      const products = await service.getAllPolls();

      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      await service.deleteProduct(product.id);

      const deletedProduct = await repository.findOneBy({ id: product.id });
      expect(deletedProduct).toBeNull();
    });
  });
});
