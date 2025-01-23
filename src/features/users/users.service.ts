import db from '@/services/db';
import { ApiError } from '@/src/lib/utils/apiError';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';

const getUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });

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
  const user = await db.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password,
        tier_id: '1',
      },
    });

    await tx.aPIKey.create({
      data: {
        name: 'Default API Key',
        user_id: newUser.id,
      },
    });

    return newUser;
  });

  if (!user) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Failed to create user');
  }

  return user;
};

const getApiKey = async (apiKey: string) => {
  return await db.aPIKey.findUnique({ where: { key: apiKey } });
};

export default { getUserByEmail, getUserById, createUser, getApiKey };
