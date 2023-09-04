import { ApiError } from "./types/ApiError";
import { CartItem } from "./types/Cart";
import { Product } from "./types/Product";

export const getError = (err: ApiError) => {
  return err.response && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export const convertProductToCartItem = (product: Product): CartItem => {
  const cartItem: CartItem = {
    _id: product._id || "",
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    quantity: 1,
  };
  return cartItem;
};
