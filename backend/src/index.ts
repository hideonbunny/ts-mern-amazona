import express from "express";

import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";
import { productRouter } from "./routers/productRouter";
import { seedRouter } from "./routers/seedRouter";
// import { productRouter } from "./routers/productRouter";
// import { seedRouter } from "./routers/seedRouter";

dotenv.config();

const app = express();
app.use(cors());
app.use("/api/products", productRouter);
app.use("/api/seed", seedRouter);

app.use("/api/products", productRouter);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/amazona";
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("error mongodb");
  });

// test

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
