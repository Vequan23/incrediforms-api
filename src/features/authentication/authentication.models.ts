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

export { CreateUserDTO, LoginUserDTO, RegisterResponse, LoginResponse, GoogleUserData, RequestWithCookies, GoogleLoginRequest };