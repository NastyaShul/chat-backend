import express from "express";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import bodyparser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { userController } from "./controllers/user.controller";

import { exceptionFilter } from "./commons/errors/exception.filter";
import { config } from "./commons/config";
import { roomController } from "./controllers/room.controller";

export class App {
   app = express();
   server = http.createServer(this.app);
   io = new Server(this.server)

   PORT = config.app.port;

   useRoutes() {
      this.app.use("/users", userController.router);
      this.app.use("/rooms", roomController.router);
   }

   useMiddlewares() {
      this.app.use(helmet());
      this.app.use(cors());
      this.app.use(
         morgan(':date[iso] ":method :url" :status :res[content-length]')
      );
      this.app.use(bodyparser.urlencoded({ extended: true }));
      this.app.use(bodyparser.json());
   };

   async initDb() {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.DB_LINK!);
      console.log("MongoDB connection established successfully");
   };

   async init() {
      this.useMiddlewares();
      this.useRoutes();
      await this.initDb();

      this.app.use(exceptionFilter.catch.bind(exceptionFilter));

      this.io.on("connection", (socket) => {
         console.log(`User connected: ${socket.id}`);

         socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
         });
      });

      this.server.listen(this.PORT, () => {
         console.log(`Server listening on port ${this.PORT}`);
      });

      process.on("uncaughtException", (err: Error) => {
         console.log("Uncaught error", err.message);
      });

      process.on("unhandledRejection", (err: Error) => {
         console.log("Uncaught ASYNC error", err.message);
      });
   }
}

(async () => {
   const app = new App();
   await app.init();
})();