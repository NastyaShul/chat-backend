import { StatusCodes } from 'http-status-codes';
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { HttpError } from '../commons/errors/http.error';
import { UserModel, User } from './../models/user.model';
import { UpdateUserParams } from '../commons/types-and-interfaces';
import { ChatRoomModel, ChatRoom } from '../models/room.model';

export class UserService {

   async registration(
      username: string,
      email: string,
      password: string,
      params: object
   ): Promise<User> {
      const checkUserEmail: User | null = await UserModel.findOne({ email });
      const checkUserName: User | null = await UserModel.findOne({
         username
      });
      if (checkUserEmail || checkUserName) {
         throw new HttpError(StatusCodes.CONFLICT, "User already exist", "UserController");
      }
      const hashPassword = await bcrypt.hash(password, 7);
      return UserModel.create({ _id: new Types.ObjectId(), ...params, password: hashPassword });
   }

   async login(
      username: string,
      email: string,
      password: string,
   ) {
      const checkUserEmail: User | null = await UserModel.findOne({ email });
      const checkUserName: User | null = await UserModel.findOne({ username });

      let user;
      if (checkUserEmail) {
         user = checkUserEmail;
      } else if (checkUserName) {
         user = checkUserName;
      } else {
         throw new HttpError(StatusCodes.NOT_FOUND, `User is not registered`, "UserController");
      }

      const validPassword = bcrypt.compareSync(password, user!.password);
      if (!validPassword) {
         throw new HttpError(StatusCodes.NOT_FOUND, "Password is not valid", "UserController");
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
      return { user, token };
   }

   async getAllUsers(): Promise<User[]> {
      const users = await UserModel.find({});
      return users;
   }

   async updateUserProfile(
      userId: Types.ObjectId,
      params: UpdateUserParams
   ) {
      const user = await UserModel.findById(userId);
      if (!user) {
         throw new HttpError(StatusCodes.NOT_FOUND, "User is not found", "UserController");
      }

      let { username, email, password } = params;

      if (username) {
         const existingUser = await UserModel.findOne({ username });
         if (existingUser && !existingUser._id.equals(user._id)) {
            throw new HttpError(StatusCodes.CONFLICT, `Username ${username} already exists for another user`, "UserController");
         }
      }

      if (email) {
         const existingUser = await UserModel.findOne({ email });
         if (existingUser && !existingUser._id.equals(user._id)) {
            throw new HttpError(StatusCodes.CONFLICT, `Email ${email} already exists for another user`, "UserController");
         }
      }

      if (password) {
         const hashPassword = await bcrypt.hash(password, 7);
         params.password = hashPassword;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
         userId,
         params,
         { new: true }
      );

      return updatedUser;
   }

   async deleteUserProfile(_id: Types.ObjectId) {
      const user = await UserModel.findByIdAndDelete(_id);
      if (!user) {
         throw new HttpError(StatusCodes.NOT_FOUND, "User is not found", "UserController");
      }
      return user;
   }

   async createRoom(
      roomName: string,
      description: string,
      userId: Types.ObjectId
      ): Promise<ChatRoom> {
      const user = await UserModel.findById(userId);
      if (!user) {
         throw new HttpError(StatusCodes.NOT_FOUND, "User is not found", "UserController");
      }

      const existingRoom = await ChatRoomModel.findOne({ name: roomName });
      if (existingRoom) {
         throw new HttpError(StatusCodes.CONFLICT, `A room with the name "${roomName}" already exists`, "UserController");
      }

      const newRoom = await ChatRoomModel.create({
         name: roomName,
         description,
         owner: user
      });

      await user.save();

      return newRoom;
   }

   async getRooms(): Promise<ChatRoom[]>{
      return await ChatRoomModel.find({});
   }

}

export const userService = new UserService();
