export interface Order {
    _id: string;
    id: number;
    shippingAddress?: { details: string; phone: string; city: string };
    taxPrice: number;
    shippingPrice: number;
    totalOrderPrice: number;
    paymentMethodType: 'cash' | 'card';
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    paidAt?: string;
    cartItems: OrderItem[];
  }
  
  export interface OrderItem {
    _id: string;
    count: number;
    price: number;
    product: { _id: string; title: string; imageCover: string };
  }