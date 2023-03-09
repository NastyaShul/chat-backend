import dotenv from "dotenv";
import { IConfig } from "./types-and-interfaces";

dotenv.config();

export const config: IConfig = {
   app: {
      port: Number.parseInt(process.env.PORT || "5000", 10)
   },
   db: {
      port: Number.parseInt(process.env.DB_PORT || "27017", 10),
      host: process.env.DB_HOST || "localhost",
      dbName: process.env.DB_NAME || "chat",
   }
}