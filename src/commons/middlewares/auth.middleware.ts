import { NextFunction, Request, Response, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, DecodedToken } from '../types-and-interfaces';
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


export const extractUserIdFromToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ message: 'Authorization header is missing' });
      }
      const token = authHeader.split(' ')[1]; 
      
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      req.userId = decodedToken.userId;
      next();
   } catch (error) {
      res.status(401).json({ message: 'Authentication failed!' });
   }
};