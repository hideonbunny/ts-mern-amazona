import express from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/productModel";

export const categoryRouter = express.Router();

categoryRouter.get(
  "/:category",
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find({ category: req.params.category });
    if (products) {
      res.json(products);
    } else {
      res.status(404).json({ message: "Products Not Found" });
    }
  })
);
