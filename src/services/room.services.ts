import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { HttpError } from "../commons/errors/http.error";
import { ChatRoomModel } from "../models/room.model";

export class RoomService {

   async deleteRoom(
      _id: string,
   ) {
      const currentRoom = await ChatRoomModel.findByIdAndDelete({ _id: new Types.ObjectId(_id) });
      if (!currentRoom) {
         throw new HttpError(StatusCodes.NOT_FOUND, "Room is not found", "RoomController")
      }
   }

   async updateRoom(
      _id: string,
      params: object
   ) {
      const room = await ChatRoomModel.findByIdAndUpdate(
         { _id: new Types.ObjectId(_id) },
         params,
         { new: true }
      );
      if (!room) {
         throw new HttpError(StatusCodes.NOT_FOUND, "Room is not found", "RoomController");
      }
      return room;
   }

}

export const roomService = new RoomService();