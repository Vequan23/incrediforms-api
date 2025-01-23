import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}

interface RequestWithApiKey extends Request {
  apiKey?: {
    id: string;
  };
}

export { RequestWithUser, RequestWithApiKey };
