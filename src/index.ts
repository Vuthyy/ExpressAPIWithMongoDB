import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import itemRouter from "./routes/item.route";

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

// MongoDB connection URI
mongoose
  .connect(
    "mongodb+srv://vuthydev:thydev1122@expressmongodb.qypcd.mongodb.net/ProductsItem?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
