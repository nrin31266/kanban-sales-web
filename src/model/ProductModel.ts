import { CategoryResponse } from "./CategoryModel";
import { SupplierResponse } from "./SupplierModel";

export interface ProductResponse {
  id: string
  options: string[];
  title: string
  description: string
  slug: string
  supplierId: string
  content: string
  expiredDate: string
  images: string[]
  categoryIds: string[]
  createdAt: string
  updatedAt: string

  supplierResponse: SupplierResponse
  categoryResponse: CategoryResponse[]

  maxPrice:number;
  minPrice: number;

  totalSold: number;

  countRating: number
  averageRating: number
}
