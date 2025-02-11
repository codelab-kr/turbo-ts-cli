import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './interfaces/product.interface';
import { CreateProductRequest } from './dto/create-product.request';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  @Post()
  async createProduct(@Body() createProductRequest: CreateProductRequest) {
    return this.productsService.createProduct(createProductRequest);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: Partial<Product>
  ) {
    return this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
