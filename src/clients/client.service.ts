/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './client.entity';
import { ProductDto } from './client.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(dto: ProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async updateProduct(dto: ProductDto, id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    const updatedProduct = {
      ...dto,
      id: product.id,
    };

    return this.productRepository.save(updatedProduct);
  }

  async getAllPolls(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }
}
