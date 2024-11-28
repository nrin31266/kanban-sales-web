export const PayMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  PAYPAL: "PAYPAL",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
} as const; // Thêm as const để tạo đối tượng bất biến

export const PayMethodLabel = {
  CREDIT_CARD: "Credit Card",
  PAYPAL: "PayPal",
  CASH_ON_DELIVERY: "Cash on Delivery",
} as const;

// type PayMethodKey = keyof typeof PayMethodLabel;

// Import Status and PaymentMethod

export const Status = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  RETURNS: "RETURNS",
  DENY: "DENY"
} as const;

export const StatusDetails: Record<
  string,
  { label: string; color: string; description: string }
> = {
  PENDING: {
    label: "Pending",
    color: "#FFAA00", // Sáng hơn và đậm nét hơn Yellow
    description: "The order is waiting to be processed.",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "#1CA7EC", // Xanh biển tươi
    description:
      "The order has been confirmed and is preparing for processing.",
  },
  SHIPPING: {
    label: "Shipping",
    color: "#0056D2", // Xanh biển đậm để tạo cảm giác mạnh mẽ
    description: "The order is being shipped to your address.",
  },
  DELIVERED: {
    label: "Delivered",
    color: "#34D058", // Xanh lá sáng tươi hơn
    description: "The order has been successfully delivered.",
  },
  COMPLETED: {
    label: "Completed",
    color: "#ADB5BD", // Xám nhạt hơn, phù hợp trạng thái hoàn thành
    description: "The order is completed and has no issues.",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#E63946", // Đỏ hồng sáng để nổi bật hơn
    description:
      "The order has been cancelled and cannot be processed further.",
  },
  RETURNS: {
    label: "Returned",
    color: "#FF6F61", // Cam đỏ tạo cảm giác cảnh báo nhưng không quá gắt
    description:
      "The order has been returned and is waiting for further processing.",
  },
  DENY: {
    label: "Deny",
    color: "#4B0082", // Tím đậm để tạo cảm giác bị từ chối
    description: "The order has been denied and is not accepted.",
  },
};


export interface OrderRequest {
  customerName: string; // Tên khách hàng
  customerPhone: string; // Số điện thoại khách hàng
  discountCode?: string;
  customerAddress: string; // Địa chỉ khách hàng
  customerEmail?: string;
  paymentMethod: String; // Phương thức thanh toán
  orderProductRequests: ProductRequest[]; // Danh sách các sản phẩm trong đơn hàng
}

export interface ProductRequest {
  name: string; // Tên sản phẩm
  subProductId: string; // ID sản phẩm phụ (nếu có)
  productId: string; // ID sản phẩm chính
  price: number; // Giá sản phẩm
  count: number; // Số lượng sản phẩm
  imageUrl: string; // URL hình ảnh sản phẩm
  options: any;
}

export interface OrderResponse {
  id: string;
  created: string,
  updated: string,
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  paymentMethod: string;
  discountCode: any;
  status: string;
  reduction: any;
  amount: number;
  createdAt: string;
  isComplete: boolean,
  
  updatedAt: string;
  orderProductResponses: OrderProductResponse[];
}

export interface OrderProductResponse {
  id: string;
  orderId: string;
  name: string;
  subProductId: string;
  productId: string;
  isRating: boolean
  price: number;
  count: number;
  options: Record<string, string>;
  imageUrl: string;
  updatedAt: string;
  createdAt: string;
}
