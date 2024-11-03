export interface PromotionRequest {
  name: string;
  description: string;
  discountType: boolean;
  value: number;
  quantity: number;
  imageUrl: string;
  code: string;
  start: string;
  end: string;
}

export interface PromotionResponse {
  id: string;
  name: string;
  description: string;
  code: string;
  discountType: string;
  value: number;
  quantity: number;
  start: string;
  end: string;
  created: string;
  modified: string;
  imageUrl: string;
}
