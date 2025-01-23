import usersService from "../users/users.service";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { notificationsService } from "../notifications/notifications.service";

const register = async (email: string, password: string) => {
  const user = await usersService.getUserByEmail(email);

  if (user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    password: hashedPassword,
  };

  const userAccount = await usersService.createUser(newUser.email, newUser.password);

  if (!userAccount) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create user');
  }

  const token = jwt.sign({ id: userAccount.user.id, email: userAccount.user.email }, process.env.JWT_SECRET as string);

  await notificationsService.sendNewUserNotification(userAccount.user);

  return {
    token,
    user: {
      id: userAccount.user.id,
      email: userAccount.user.email,
      tier_id: userAccount.user.tier_id,
      created_at: userAccount.user.created_at,
    },
    apiKey: userAccount.apiKey,
  }

};

const login = async (email: string, password: string) => {
  const userAccount = await usersService.getUserByEmail(email);

  if (!userAccount) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, userAccount.user?.password || '');

  if (!isPasswordValid) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  }

  const token = jwt.sign({ id: userAccount.user?.id, email: userAccount.user?.email }, process.env.JWT_SECRET as string);

  return {
    token,
    user: {
      id: userAccount.user?.id,
      email: userAccount.user?.email,
      tier_id: userAccount.user?.tier_id,
      created_at: userAccount.user?.created_at,
    },
    apiKey: userAccount.apiKey,
  };
};

export default { register, login };
