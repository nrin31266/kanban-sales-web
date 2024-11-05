export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  slug: string;
  supplierId: string;
  content: string;
  expiredDate: string;
  images: string[];
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;

  maxPrice?:number;
  minPrice?: number;
}
