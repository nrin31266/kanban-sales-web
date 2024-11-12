export interface CartRequest {
    createdBy: string
    subProductId: string
    quantity: number
    count: number
    options: Record<string, string>
}