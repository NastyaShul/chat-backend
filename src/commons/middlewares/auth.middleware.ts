import { NextFunction, Request, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from '../types-and-interfaces';
import { HttpError } from '../errors/http.error';

export const authMiddleware: RequestHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   if (req.method === "options") {
      return next();
   }

   try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
         throw new HttpError(StatusCodes.FORBIDDEN, "User is not authenticated");
      }
      const decodeData = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decodeData;
      next();
   }
   catch (err) {
      next(err);
   }
}