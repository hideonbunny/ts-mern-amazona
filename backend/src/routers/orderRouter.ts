import express, { Request, Response } from "express";
import { isAuth } from "../utils";
import asyncHandler from "express-async-handler";
import { OrderModel } from "../models/orderModel";
import { Product } from "../models/productModel";
export const orderRouter = express.Router();

orderRouter.get(
  "/mine",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id });

    res.json(orders);
  })
);

orderRouter.get(
  // /api/orders/:id
  "/:id",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      //order.paidAt = new Date(Date.now());
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  })
);

orderRouter.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
    } else {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((item: Product) => ({
          ...item,
          product: item._id,
        })),
        shippingAddress: req.body.shippingAddress,
        user: req.user._id,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
      });
      res.status(201).json({ message: "order not found", order: createdOrder });
    }
  })
);
