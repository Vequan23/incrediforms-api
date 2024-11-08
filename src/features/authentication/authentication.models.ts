interface CreateUserDTO {
  email: string;
  password: string;
}

interface LoginUserDTO {
  email: string;
  password: string;
}

interface RegisterResponse {
  token: string;
}

interface LoginResponse {
  token: string;
}

export { CreateUserDTO, LoginUserDTO, RegisterResponse, LoginResponse };