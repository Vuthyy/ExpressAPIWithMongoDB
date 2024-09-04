import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "./configs/.env") });

export const config = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  PORT: process.env.PORT || 4000,
};
