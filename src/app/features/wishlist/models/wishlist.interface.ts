
export interface WishlistItem {
  _id: string;
  id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  category?: {
    name: string;
  };
  inCart?: boolean;
}

export interface WishlistResponse {
  status: string;
  message?: string;
  count?: number;
  data: WishlistItem[];
}
