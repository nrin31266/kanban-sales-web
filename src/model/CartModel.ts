import { ProductResponse } from "./ProductModel";
import { SubProductResponse } from "./SubProduct";

export interface CartRequest {
    createdBy: string;
    subProductId: string;
    count: number;
    productId: string;
    imageUrl: string;
    title: string,
    subProductResponse?: SubProductResponse
}


export interface CartResponse {
    id: string | null;
    createdBy: string;
    isCreated?: boolean
    subProductId: string;
    productId: string;
    title: string;
    imageUrl: string;
    count: number;
    subProductResponse: SubProductResponse | null;
    productResponse: ProductResponse | null;
    createdAt: string | null; 
    updatedAt: string | null;
}