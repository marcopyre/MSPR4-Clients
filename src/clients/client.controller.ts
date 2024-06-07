import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './client.service';
import { ProductDto } from './client.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createProduct(@Body() dto: ProductDto) {
    return this.productService.createProduct(dto);
  }

  @Put(':id')
  updateProduct(@Body() dto: ProductDto, @Param('id') id: number) {
    return this.productService.updateProduct(dto, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllPolls();
  }
}
