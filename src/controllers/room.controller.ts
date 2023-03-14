import { Request, Response, NextFunction } from "express";
import { BaseController } from "../commons/abstract/base.controller";
import { chatRoomUpdateSchema } from "../commons/validation/room.validation";
import { roomService } from "../services/room.services";

export class RoomController extends BaseController {
   constructor() {
      super();
      this.bindRoutes([
         {
            path: "/:roomId",
            method: "delete",
            handler: this.deleteRoom,
         },
         {
            path: "/:roomId",
            method: "patch",
            handler: this.updateRoom,
            validators: {
               body: chatRoomUpdateSchema
            }
         }
      ])
   }

   deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
      const { roomId } = req.params;
      await roomService.deleteRoom(roomId);
      res.send("Room successfully deleted");
   }

   updateRoom = async (req: Request, res: Response, next: NextFunction) => {
      const { roomId } = req.params;
      const room = await roomService.updateRoom(roomId, req.body);
      res.send(`Room successfully updated: ${room}`);
   }
}

export const roomController = new RoomController;