import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sampleProduct } from "../data";
import { ProductModel } from "../models/productModel";

export const seedRouter = express.Router();

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProduct);
    res.json({ createdProducts });
  })
);
