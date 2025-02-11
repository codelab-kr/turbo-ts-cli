import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { CreateProductRequest } from './dto/create-product.request';


@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];

  createProduct(createProductRequest: CreateProductRequest) {
    const product: Product = {
      ...createProductRequest,
      id: Math.random().toString(36).substring(7),
    };
    this.products.push(product);
    return product;
  }

  updateProduct(id: string, product: Partial<Product>) {
    const index = this.products.findIndex((p) => p.id === id);
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  getProducts() {
    return this.products;
  }

  getProduct(id: string) {
    return this.products.find((product) => product.id === id);
  }
  deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products.splice(index, 1);
  }
}
