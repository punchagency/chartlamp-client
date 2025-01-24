// ----------------------------------------------------------------------
import { ChartLampUser } from "@/types/user";

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type UserActivitiesType = {
  created_at: string | Date;
  created_by: string;
  deleted_at: string | Date | null;
  deleted_by: string | null;
  id: number;
  name: string;
  note: string;
  practice_id: string;
  status: string;
  type: string;
  updated_at: string | Date | number;
  updated_by: string | null;
};

export type AuthStateType = {
  isAuthenticated: boolean;
  isOtpValid: boolean;
  signUpComplete:boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUserType;
  error: AuthUserType;
};

// ----------------------------------------------------------------------

export type SessionContextType = {
  method: string;
  isAuthenticated: boolean;
  isOtpValid: boolean;
  signUpComplete: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: ChartLampUser | null;
  error: AuthUserType;
  initialize: () => void;
  login: (username: string, password: string) => Promise<void>;
  resetwithtoken: (newPassword: string, token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  completeSignUp:  (settings: any) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  reset: (data: {
    email: string;
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }) => Promise<void>;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type FirebaseContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUserType;
  error: AuthUserType;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type AWSCognitoContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUserType;
  error: AuthUserType;
  login: (email: string, password: string) => void;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};

export type Auth0ContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: AuthUserType;
  error: AuthUserType;
  // login: () => Promise<void>;
  logout: () => void;
  // To avoid conflicts between types this is just a temporary declaration.
  // Remove below when you choose to authenticate with Auth0.
  login: (email?: string, password?: string) => Promise<void>;
  register?: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};
