import { Request, Response, NextFunction } from "express";
import Item from "../models/item.model"; // Ensure correct path for Item model
import GlobalError from "../middlewares/errorHandler"; // Ensure correct path for GlobalError

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return next(new GlobalError(`Item with ID ${id} not found`, 404));
    }
    res.status(200).json(item);
  } catch (error) {
    next(
      new GlobalError(
        `Failed to retrieve the item with ID. Please ensure the ID is correct and try again.`,
        500
      )
    );
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const category = req.query.category as string;
    const sortBy = (req.query.sortBy as string) || "price";
    const order = req.query.order === "desc" ? -1 : 1;

    const minStock = parseInt(req.query.minStock as string); // Default min stock to undefined
    const maxStock = parseInt(req.query.maxStock as string); // Default max stock to undefined

    const skip = (page - 1) * limit;

    const filter: any = {};

    if (category) {
      filter.category = { $regex: new RegExp(category, "i") }; // Case-insensitive search
    }

    if (minStock || maxStock) {
      filter.stock = {};
      if (minStock) {
        filter.stock.$gte = minStock;
      }
      if (maxStock) {
        filter.stock.$lte = maxStock;
      }
    }

    const items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order });

    const totalitems = await Item.countDocuments(filter);

    if (items.length === 0) {
      res
        .status(404)
        .json({ message: "No items found matching the criteria." });
    }

    const totalPages = Math.ceil(totalitems / limit);

    res.status(200).json({
      totalitems,
      totalPages,
      currentPage: page,
      items,
    });
  } catch (error) {
    next(
      new GlobalError(
        "Failed to retrieve items. There was an issue with the query parameters or the database connection.",
        500
      )
    );
  }
};

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(
      new GlobalError(
        "Failed to create the item. Please check the request data and try again.",
        500
      )
    );
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!item) {
      return next(new GlobalError(`Item with ID ${id} not found`, 404));
    }

    res.status(200).json(item);
  } catch (error) {
    next(
      new GlobalError(
        `Failed to update the item with ID. Please ensure the ID is correct and the request data is valid.`,
        500
      )
    );
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the item exists before attempting to delete
    const item = await Item.findByIdAndDelete(id);

    // If the item was not found, return a 404 error
    if (!item) {
      return next(new GlobalError(`Item with ID ${id} not found`, 404));
    }

    // Successfully deleted
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    // Handle any unexpected errors
    next(
      new GlobalError(
        "An error occurred while deleting the item. Please try again later.",
        500
      )
    );
  }
};
