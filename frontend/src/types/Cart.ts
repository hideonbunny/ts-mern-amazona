export type CartItem = {
  _id: string;
  image: string | undefined;
  slug: string;
  quantity: number;
  countInStock: number;
  price: number;

  name: string;
};

export type ShippingAddress = {
  fullname: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

export type Cart = {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
};
