export const PayMethod = {
    CREDIT_CARD: 'CREDIT_CARD',
    PAYPAL: 'PAYPAL',
    CASH_ON_DELIVERY: 'CASH_ON_DELIVERY'
} as const;  // Thêm as const để tạo đối tượng bất biến

export const PayMethodLabel = {
    CREDIT_CARD: 'Credit Card',
    PAYPAL: 'PayPal',
    CASH_ON_DELIVERY: 'Cash on Delivery',
  } as const;

// Import Status and PaymentMethod

export const Status = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    SHIPPING: "SHIPPING",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
} as const;

export interface OrderRequest {
    
    customerName: string;  // Tên khách hàng
    customerPhone: string;  // Số điện thoại khách hàng
    discountCode?: string
    customerAddress: string;  // Địa chỉ khách hàng
    customerEmail?: string
    paymentMethod: String;  // Phương thức thanh toán
    orderProductRequests: ProductRequest[];  // Danh sách các sản phẩm trong đơn hàng
}

export interface ProductRequest {
    name: string;  // Tên sản phẩm
    subProductId: string;  // ID sản phẩm phụ (nếu có)
    productId: string;  // ID sản phẩm chính
    price: number;  // Giá sản phẩm
    count: number;  // Số lượng sản phẩm
    imageUrl: string;  // URL hình ảnh sản phẩm
    options: any;
}
