import { Request, Response, NextFunction, Router } from "express";
import { Logger } from "tslog";
import { ValidationError } from "../errors/validation.error";
import { IControllerRoute, Validation } from './../types-and-interfaces';
import { authMiddleware, extractUserIdFromToken } from "../middlewares/auth.middleware";

export abstract class BaseController {
   private readonly _router = Router();
   readonly logger = new Logger();

   get router(): Router {
      return this._router;
   }

   protected bindRoutes(routes: IControllerRoute[]) {
      for (const route of routes) {
         this.logger.info(`Route attached [${route.method}] ${route.path}`);
         const handler = this.catchErrorHandler(route.handler);
         const pipeline = [];
         if (route.validators) {
            pipeline.push(this.createValidators(route.validators));
         }
         if (route.authRequired) {
            pipeline.push(authMiddleware);
         }
         if (route.extractUserId) {
            pipeline.push(extractUserIdFromToken);
         }
         this.router[route.method](route.path, pipeline, handler);
      }
   }

   catchErrorHandler(handler: any) {
      return async (req: Request, res: Response, next: NextFunction) => {
         try {
            await handler.bind(this)(req, res, next)
         } catch (err) {
            next(err);
         }
      };
   }

   createValidators(validators: Validation) {
      return (req: Request, res: Response, next: NextFunction) => {
         let errors: any[] = [];
         const joiOptions = {
            abortEarly: false,
            allowUnknown: true,
            stipUnknown: true,
         };

         for (const validatorName of Object.keys(validators)) {
            const result = validators[validatorName as keyof Validation].validate(
               req[validatorName as keyof Request],
               joiOptions
            );

            if (result.value) {
               req[
                  validatorName as keyof Pick<
                     Request,
                     "body" | "query" | "params" | "headers" | "cookies"
                  >
               ] = result.value;
            }
            if (result.error) errors = errors.concat(result.error.details);
         }

         if (errors.length) {
            throw new ValidationError(errors);
         }
         next();
      }
   }
}