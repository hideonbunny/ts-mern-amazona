import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sampleProduct, sampleUsers } from "../data";
import { ProductModel } from "../models/productModel";
import { UserModel } from "../models/userModel";

const seedRouter = express.Router();

seedRouter.get("/test", (req, res) => {
  res.send("Seed Router Test");
});

seedRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(sampleProduct);

    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);

    res.json({ createdProducts, createdUsers });
  })
);

export { seedRouter };
