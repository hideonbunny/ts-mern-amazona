import { NextFunction, Request, Response } from "express";
import { User } from "./models/userModel";
import jwt from "jsonwebtoken";

export const gengerateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret"
    ) as {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      token: string;
    };
    req.user = decode;
    next();
  } else {
    res.status(401).json({ message: "Invalid Token" });
  }
};
