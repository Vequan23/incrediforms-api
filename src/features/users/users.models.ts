interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  tierId: string;
  logoUrl?: string;
}

export { User };
