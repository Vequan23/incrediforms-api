import db from '@/services/db';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const getUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'User not found');
  }

  return user;
};

const getUserById = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'User not found');
  }

  return user;
};

const createUser = async (email: string, password: string) => {
  const user = await db.user.create({
    data: {
      email,
      password,
      tier_id: '1',
    },
  });

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create user');
  }

  return user;
};

export default { getUserByEmail, getUserById, createUser };
