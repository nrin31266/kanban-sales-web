export interface SubProductResponse {
  id: string;
  options: any;
  discount: number;
  price: number;
  quantity: number;
  images: string[];
  productId: string;
  createdAt: string;
  updatedAt: string;
  //
  imgUrlSelected?: string;
  count: number;
  createdBy: string;
}
