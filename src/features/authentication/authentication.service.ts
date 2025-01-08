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

  const insertedUser = await usersService.createUser(newUser.email, newUser.password);

  if (!insertedUser) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create user');
  }

  const token = jwt.sign({ id: insertedUser.id, email: insertedUser.email }, process.env.JWT_SECRET as string);

  await notificationsService.sendNewUserNotification(insertedUser);

  return {
    token,
    user: {
      id: insertedUser.id,
      email: insertedUser.email,
      tier_id: insertedUser.tier_id,
      created_at: insertedUser.created_at,
    },
  }

};

const login = async (email: string, password: string) => {
  const user = await usersService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      tier_id: user.tier_id,
      created_at: user.created_at,
    },
  };
};

export default { register, login };
