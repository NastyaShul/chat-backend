import { NextFunction, Request, Response } from "express";
import { BaseController } from "../commons/abstract/base.controller";
import { userService } from "../services/user.services";
import { userRegisterSchema, userUpdateSchema } from "../commons/validation/user.validation";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../commons/types-and-interfaces";
import { chatRoomSchema } from "../commons/validation/room.validation";

export class UserController extends BaseController {
   constructor() {
      super();
      this.bindRoutes([
         {
            path: "/register",
            method: "post",
            handler: this.register,
            validators: {
               body: userRegisterSchema
            }
         },
         {
            path: "/login",
            method: "post",
            handler: this.login,
         },
         {
            path: "/",
            method: "get",
            authRequired: true,
            handler: this.getAllUsers,
         },
         {
            path: "/:userId",
            method: "patch",
            authRequired: true,
            extractUserId: true,
            validators: {
               body: userUpdateSchema
            },
            handler: this.updateUserProfile,
         },
         {
            path: "/:userId",
            method: "delete",
            authRequired: true,
            handler: this.deleteUserProfile
         },
         {
            path: "/rooms",
            method: "post",
            authRequired: true,
            extractUserId: true,
            validators: {
               body: chatRoomSchema
            },
            handler: this.createRoom
         },
         {
            path: "/rooms",
            method: "get",
            authRequired: true,
            handler: this.getRooms
         },
      ])
   }

   register = async (req: Request, res: Response, next: NextFunction) => {
      const { username, email, password } = req.body;
      const user = await userService.registration(username, email, password, req.body);
      res.send(user);
   }

   login = async (req: Request, res: Response, next: NextFunction) => {
      const { username, email, password } = req.body;
      const response = await userService.login(username, email, password);
      res.send(response);
   }

   getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
      const response = await userService.getAllUsers();
      res.send(response);
   }

   updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const { userId } = req.params;

      const user = await userService.updateUserProfile(new Types.ObjectId(userId), req.body);
      res.send(`User profile successfully updated: ${user}`)
   }

   deleteUserProfile = async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params;
      const user = await userService.deleteUserProfile(new Types.ObjectId(userId));
      res.send("User profile successfully deleted");
   }

   createRoom = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const { name, description } = req.body;
      const { userId } = req;

      const room = await userService.createRoom(name, description, new Types.ObjectId(userId));
      res.send(`Room created successfully: ${room}`);
   }

   getRooms = async (req: Request, res: Response, next: NextFunction) => {
      const response = await userService.getRooms();
      res.send(response);
   }

}

export const userController = new UserController