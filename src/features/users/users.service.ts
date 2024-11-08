import db from '@/services/db';

const getUserByEmail = async (email: string) => {
  return db.user.findUnique({ where: { email } });
};

const getUserById = async (id: string) => {
  return db.user.findUnique({ where: { id } });
};

const createUser = async (email: string, password: string) => {
  return db.user.create({
    data: {
      email,
      password,
      tier_id: '1',
    },
  });
};

export default { getUserByEmail, getUserById, createUser };
