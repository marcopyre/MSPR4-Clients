import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './client.service';
import { Product } from './client.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;
  let product: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
