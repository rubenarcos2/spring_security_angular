export interface Product {
  id?: number;
  name?: string;
  description?: string;
  supplier?: string;
  supplierName?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  priceAvg?: number;
  image?: string;
  thumbail_32x32?: string;
  thumbail_128x128?: string;
  stock?: number;
  isDeleting?: boolean;
}
