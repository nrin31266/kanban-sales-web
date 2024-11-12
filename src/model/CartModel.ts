export interface CartRequest {
    createdBy: string
    imageUrl: string
    subProductId: string
    quantity: number
    count: number
    options: Record<string, string>
}

export interface CartResponse {
    id: string
    createdBy: string
    subProductId: string
    quantity: number
    imageUrl: string
    count: number
    options: Record<string, string>
    createdAt: string
    updatedAt: string
}