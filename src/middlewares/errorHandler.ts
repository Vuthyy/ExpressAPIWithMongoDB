import { Request, Response, NextFunction } from "express";
class GlobalError extends Error {
  status: string;
  statusCode: number;
  isOperation: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status =
      statusCode >= 400 && 500 < statusCode
        ? "Client error"
        : "Something went wrong";
    this.statusCode = statusCode;
    this.isOperation = true;
  }
}
export default GlobalError;

// Define error-handle function
const errorMiddleware = (
  err: GlobalError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal server error",
  });
};

export { GlobalError, errorMiddleware };
