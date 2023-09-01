import { Product } from "./types/Product";

export const sampleProduct: Product[] = [
  {
    name: "Nike slim shirt",
    slug: "nike-slim-shirt",
    category: "Shirts",
    image: "../images/p1.jpg",
    price: 120,
    countInStock: 10,
    brand: "Nike",
    rating: 4.5,
    numReviews: 10,
    description: "high quality product",
  },
  {
    name: "Adidas fit shirt",
    slug: "adidas-fit-shirt",
    category: "Shirts",
    image: "../images/p2.jpg",
    price: 250,
    countInStock: 20,
    brand: "Adidas",
    rating: 4.0,
    numReviews: 10,
    description: "high quality product",
  },
  {
    name: "Nike slim pants",
    slug: "nike-slim-pants",
    category: "Pants",
    image: "../images/p3.jpg",
    price: 120,
    countInStock: 15,
    brand: "Nike",
    rating: 4.5,
    numReviews: 14,
    description: "high quality product",
  },
  {
    name: "Adidas fit pants",
    slug: "adidas-fit-pants",
    category: "Pants",
    image: "../images/p4.jpg",
    price: 90,
    countInStock: 5,
    brand: "Adidas",
    rating: 4.5,
    numReviews: 10,
    description: "high quality product",
  },
];
