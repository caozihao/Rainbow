import { Request, Response } from 'express';

export function postRequest(req: Request, res: Response) {
  const result = {
    code: 0,
    errMsg: '',
  };
  return res.status(200).send(result);
}
