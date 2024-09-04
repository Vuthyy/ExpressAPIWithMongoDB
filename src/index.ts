import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import itemRouter from "./routes/item.route";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request Time: ${new Date().toISOString()}`);
  next();
});

// Routes
app.use("/items", itemRouter);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Node API Server Updated");
});

// This is Global Error Handler
app.use(errorHandler);

// MongoDB Connection and Server Start
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to the database!");
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed!", err);
    process.exit(1); // Exit the application on connection failure
  });
