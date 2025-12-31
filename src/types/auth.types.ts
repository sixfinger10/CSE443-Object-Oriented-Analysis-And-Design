// Backend'deki SignInRequest ile eşleşen interface
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

// Backend'deki SignUpRequest ile eşleşen interface
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// Backend'deki AuthResponse ile eşleşen interface
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: UserData;
  };
}

export interface UserData {
  id: number;
  username: string;
  email: string;
}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}