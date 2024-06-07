import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './client.service';
import { Product } from './client.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../app.module';

describe('ProductService', () => {
  let app: INestApplication;
  let service: ProductService;
  let repository: Repository<Product>;
  let product: Product;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>('ProductRepository');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    product = await repository.create({
      name: 'Test Product',
      max: 10,
      membres: [],
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
        max: 5,
        membres: [],
      });

      expect(newProduct).toBeDefined();
      expect(newProduct.id).toBeDefined();
      expect(newProduct.name).toEqual('New Product');
      expect(newProduct.max).toEqual(5);
      expect(newProduct.membres).toEqual([]);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updatedProduct = await service.updateProduct(
        {
          name: 'Updated Product',
          max: 7,
          membres: [],
        },
        product.id,
      );

      expect(updatedProduct).toBeDefined();
      expect(updatedProduct.id).toEqual(product.id);
      expect(updatedProduct.name).toEqual('Updated Product');
      expect(updatedProduct.max).toEqual(7);
      expect(updatedProduct.membres).toEqual([]);
    });
  });

  describe('getAllProducts', () => {
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
