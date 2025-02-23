import express, { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { schemaValidatorMiddleware } from '@/middleware/schemaValidatorMiddleware';

import authenticationController from './authentication.controller';
import { CREDENTIALS_SCHEMA } from './authentication.schemas';
import { requiresAuthMiddleware } from '@/src/lib/middleware/requiresAuthMiddleware';
import usersService from '../users/users.service';
import { notificationsService } from '../notifications/notifications.service';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const router = express.Router();

router.post('/register', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.register);
router.post('/login', schemaValidatorMiddleware(CREDENTIALS_SCHEMA), authenticationController.login);
// used for zapier integration
router.get('/me', authenticationController.getUserByApiKey);
router.get('/user', requiresAuthMiddleware, authenticationController.getUserById);

const client: OAuth2Client = new OAuth2Client();

interface GoogleUserData {
  userId: string;
  email: string;
  emailVerified: boolean;
  name: string | undefined;
  pictureUrl: string | undefined;
  givenName: string | undefined;
  familyName: string | undefined;
  hostedDomain: string | undefined;
  isGoogleAuthoritative: boolean;
}

// Interface for request with cookies
interface RequestWithCookies extends Request {
  cookies: {
    g_csrf_token?: string;
  };
}

// Interface for login request body
interface GoogleLoginRequest {
  credential?: string;
  g_csrf_token?: string;
}

const verifyGoogleToken = async (
  token: string,
  clientId: string
): Promise<GoogleUserData> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });


    const payload: TokenPayload | undefined = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Extract relevant information from payload
    const userData: GoogleUserData = {
      userId: payload.sub,
      email: payload.email || '',
      emailVerified: payload.email_verified || false,
      name: payload.name,
      pictureUrl: payload.picture,
      givenName: payload.given_name,
      familyName: payload.family_name,
      hostedDomain: payload.hd,
      isGoogleAuthoritative: true
    };

    // Determine if Google is authoritative for this account
    userData.isGoogleAuthoritative = isGoogleAuthoritative(userData);

    return userData;
  } catch (error) {
    throw new Error(`Token verification failed: ${(error as Error).message}`);
  }
};

const isGoogleAuthoritative = (userData: GoogleUserData): boolean => {
  if (userData.email.endsWith('@gmail.com')) {
    return true;
  }

  // Case 2: Verified G Suite/Workspace account
  if (userData.emailVerified && userData.hostedDomain) {
    return true;
  }

  return false;
};

// Interface for successful response
interface SuccessResponse {
  token: string;
  user: {
    id: string;
    email: string;
    tier_id: string;
    created_at: Date;
  };
}

// Interface for error response
interface ErrorResponse {
  status: 'error';
  message: string;
}
// Login endpoint
router.post('/google', async (
  req: RequestWithCookies,
  res: Response<SuccessResponse | ErrorResponse>,
): Promise<void> => {
  try {
    const { credential } = req.body as GoogleLoginRequest;

    if (!credential) {
      res.status(400).json({
        status: 'error',
        message: 'No ID token provided'
      });
      return;
    }

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    if (!CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
    }

    const userData = await verifyGoogleToken(credential, CLIENT_ID);

    if (userData.isGoogleAuthoritative) {
      //check if user exists in db
      // if they exist return session 
      // if they don't exist create user and return session
      const { user, apiKey } = await usersService.getUserByEmail(userData.email);

      if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string);
        const response = {
          token,
          user: {
            id: user.id,
            email: user.email,
            tier_id: user.tier_id,
            created_at: user.created_at,
          },
          apiKey: apiKey?.key,
        }
        res.status(STATUS_CODES.OK).json(response);
      } else {
        const newUser = await usersService.createUser(userData.email, userData.email);
        const token = jwt.sign({ id: newUser.user.id, email: newUser.user.email }, process.env.JWT_SECRET as string);
        await notificationsService.sendNewUserNotification(newUser.user);
        const response = {
          token,
          user: {
            id: newUser?.user.id,
            email: newUser?.user.email,
            tier_id: newUser?.user.tier_id,
            created_at: newUser?.user.created_at,
          },
          apiKey: newUser?.apiKey,
        }
        res.status(STATUS_CODES.OK).json(response);
      }
    }
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

export default router;
