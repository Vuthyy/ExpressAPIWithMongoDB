import { Request, Response, NextFunction } from "express";
import Item from "../models/item.model";
import { ParsedQs } from "qs";

// export const getItems = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const items = await Item.find({});
//     res.status(200).json(items);
//   } catch (error) {
//     res.status(500).json({ message: (error as Error).message });
//   }
// };

export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "5",
      category,
      sortBy,
      sortOrder = "asc",
    } = req.query as {
      page?: string;
      limit?: string;
      category?: string;
      sortBy?: string;
      sortOrder?: string;
    };

    const query: any = {};
    if (category) {
      query.category = category;
    }

    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const items = await Item.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const totalItems = await Item.countDocuments(query);

    // Construct the response
    const response = {
      totalPages: Math.ceil(totalItems / Number(limit)),
      currentPage: Number(page),
      items,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
