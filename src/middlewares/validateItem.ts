import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

const itemSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter item name")
    .min(3, "Item should be at least 3 characters"),
  price: yup
    .number()
    .required("Please enter item price")
    .min(0, "Price cannot be negative"),
  category: yup.string().required("Please enter item category"),
  stock: yup
    .number()
    .required("Please enter item stock")
    .min(0, "Stock cannot be negative"),
});

export const validateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await itemSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
  }
};
