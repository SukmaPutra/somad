import { NextFunction, Request, Response } from "express";

type AsyncRequestHandler<TRequest extends Request = Request> = (
  req: TRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = <TRequest extends Request = Request>(
  fn: AsyncRequestHandler<TRequest>
) => {
  return (req: TRequest, res: Response, next: NextFunction) => {
    void fn(req, res, next).catch(next);
  };
};
