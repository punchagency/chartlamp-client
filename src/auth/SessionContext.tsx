import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
// utils
//
import axiosInstance, { endpoints } from "@/lib/axios";
import { ChartLampUser } from "@/types/user";
import {
  ActionMapType,
  AuthStateType,
  AuthUserType,
  SessionContextType,
} from "./types";

// ----------------------------------------------------------------------

enum Types {
  INITIAL = "INITIAL",
  ERROR = "ERROR",
  LOADING = "LOADING",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
  ACTIVITIES = "ACTIVITIES",
  TODOS = "TODOS",
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    isOtpValid: boolean;
    signUpComplete: boolean;
    isLoading: boolean;
    user: AuthUserType;
    error: AuthUserType;
  };
  [Types.LOADING]: {
    isLoading: boolean;
  };
  [Types.ERROR]: {
    error: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
    isAuthenticated: boolean;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
    isAuthenticated: boolean;
    signUpComplete: boolean;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  isOtpValid: false,
  signUpComplete: false,
  isLoading: true,
  user: null,
  error: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      isOtpValid: action.payload.isOtpValid,
      signUpComplete: action.payload.signUpComplete,
      user: action.payload.user,
      isLoading: action.payload.isLoading,
      error: action.payload.error,
    };
  }
  if (action.type === Types.LOADING) {
    return {
      ...state,
      isLoading: action.payload.isLoading,
      error: null,
    };
  }
  if (action.type === Types.ERROR) {
    return {
      ...state,
      error: action.payload.error,
      isLoading: false,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      isLoading: false,
      error: null,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: action.payload.isAuthenticated,
      signUpComplete: action.payload.signUpComplete,
      user: null,
      isLoading: false,
      error: null,
    };
  }

  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      isOtpValid: false,
      signUpComplete: false,
      user: null,
      isLoading: false,
      error: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<SessionContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      //dispatched loading state first

      const response = await axiosInstance.get(endpoints.auth.me);

      const { user } = response.data;

      if (user) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: user.twoFactorAuth?.isEnabled || true,
            isOtpValid: false,
            signUpComplete: false,
            isLoading: false,
            user,
            error: null,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          isOtpValid: false,
          signUpComplete: false,
          isLoading: false,
          user: null,
          error: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const initialPayload = {
      isAuthenticated: false,
      isLoading: true,
      isOtpValid: false,
      signUpComplete: false,
      user: null,
      error: null,
    };

    try {
      dispatch({ type: Types.INITIAL, payload: initialPayload });

      const {
        data: { user, twoFactorRequired },
      } = await axiosInstance.post(endpoints.auth.login, { email, password });

      if (user && !twoFactorRequired) {
        dispatch({
          type: Types.LOGIN,
          payload: {
            user,
            isAuthenticated: true,
          },
        });
      } else if (twoFactorRequired && user) {
        dispatch({
          type: Types.LOGIN,
          payload: {
            user,
            isAuthenticated: false,
          },
        });
      }
    } catch (error: any) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          isLoading: false,
          isOtpValid: false,
          signUpComplete: false,
          user: null,
          error: error?.message || "An error has occured, please try again!",
        },
      });
    }
  }, []);

  // RESET
  const reset = useCallback(
    async (data: {
      email: string;
      old_password: string;
      new_password: string;
      confirm_new_password: string;
    }) => {
      await axiosInstance.post("/user/reset", data);
      dispatch({
        type: Types.LOGOUT,
      });
    },
    []
  );

  // RESET

  // resetwithtoken
  const resetwithtoken = useCallback(
    async (newPassword: string, token: string) => {
      const initialPayload = {
        isAuthenticated: false,
        isLoading: true,
        isOtpValid: false,
        signUpComplete: false,
        user: null,
        error: null,
      };

      try {
        dispatch({ type: Types.INITIAL, payload: initialPayload });

        const response = await axiosInstance.post(
          endpoints.auth.resetPassword,
          {
            newPassword,
            token,
          }
        );

        dispatch({
          type: Types.INITIAL,
          payload: { ...initialPayload, isLoading: false },
        });
      } catch (error: any) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            isLoading: false,
            isOtpValid: false,
            signUpComplete: false,
            user: null,
            error: error?.message || "An error has occured, please try again!",
          },
        });
        throw error;
      }
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    const initialPayload = {
      isAuthenticated: false,
      isLoading: true,
      isOtpValid: false,
      signUpComplete: false,
      user: null,
      error: null,
    };

    try {
      dispatch({ type: Types.INITIAL, payload: initialPayload });

      await axiosInstance.post(endpoints.auth.forgotPassword, { email });

      dispatch({
        type: Types.INITIAL,
        payload: { ...initialPayload, isLoading: false },
      });
    } catch (error: any) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          isLoading: false,
          isOtpValid: false,
          signUpComplete: false,
          user: null,
          error: error?.message || "An error has occured, please try again!",
        },
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      organization?: string
    ) => {
      try {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            isLoading: true,
            isOtpValid: false,
            signUpComplete: false,
            user: null,
            error: null,
          },
        });

        const {
          data: { user },
        } = await axiosInstance.post(endpoints.auth.register, {
          email,
          password,
          name,
          organization,
        });

        dispatch({
          type: Types.REGISTER,
          payload: {
            user,
            isAuthenticated: false,
            signUpComplete: true,
          },
        });
      } catch (error: any) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            isLoading: false,
            isOtpValid: false,
            signUpComplete: false,
            user: null,
            error: error?.message || "An error has occured, please try again!",
          },
        });
      }
    },
    []
  );

  // RESEND OTP
  const resendOTP = useCallback(async () => {
    try {
      dispatch({
        type: Types.LOADING,
        payload: {
          isLoading: true,
        },
      });

      const response = await axiosInstance.get(endpoints.auth.resendOTP);
      const { status } = response.data;
      if (status) {
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: state.user,
            isAuthenticated: false,
          },
        });
      }
    } catch (error: any) {
      dispatch({
        type: Types.ERROR,
        payload: {
          error: error?.message || "An error has occured, please try again!",
        },
      });
    }
  }, [state.user]);

  // VERIFY OTP
  const verifyOTP = useCallback(
    async (token: string) => {
      try {
        dispatch({
          type: Types.LOADING,
          payload: {
            isLoading: true,
          },
        });

        const response = await axiosInstance.post(endpoints.auth.verifyOTP, {
          token,
        });

        const { status } = response.data;

        if (status) {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: state.user,
              isOtpValid: true,
              signUpComplete: false,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            },
          });
        }
      } catch (error: any) {
        dispatch({
          type: Types.ERROR,
          payload: {
            error: error?.message || "An error has occured, please try again!",
          },
        });
      }
    },
    [state.user]
  );

  // VERIFY OTP
  const completeSignUp = useCallback(
    async (settings: any) => {
      try {
        dispatch({
          type: Types.LOADING,
          payload: {
            isLoading: true,
          },
        });

        const response = await axiosInstance.post(
          `/user/final/${state?.user?.id}`,
          {
            ...settings,
            practice_name: settings.name,
            firstname: state.user?.name
              ? state.user?.name?.split(" ")?.[0]
              : "",
            lastname: state.user?.name ? state.user?.name?.split(" ")?.[1] : "",
            user_id: state?.user?.id,
          }
        );

        const { access_token, staff: user } = response.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: user || null,
            isOtpValid: false,
            signUpComplete: true,
            isAuthenticated: Boolean(access_token),
            isLoading: false,
            error: null,
          },
        });
      } catch (error: any) {
        dispatch({
          type: Types.ERROR,
          payload: {
            error: error?.message || "An error has occured, please try again!",
          },
        });
      }
    },
    [state.user]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    //clear cookies
    await axiosInstance.post(endpoints.auth.logout);
    window.location.href = "/auth/signin";
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue: SessionContextType = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      isOtpValid: state.isOtpValid,
      signUpComplete: state.signUpComplete,
      isLoading: state.isLoading,
      user: state.user as ChartLampUser | null,
      error: state.error,
      method: "jwt",
      initialize,
      login,
      forgotPassword,
      resetwithtoken,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      verifyOTP,
      resendOTP,
      completeSignUp,
      logout,
      reset,
    }),
    [
      state.isAuthenticated,
      state.isOtpValid,
      state.signUpComplete,
      state.isInitialized,
      state.user,
      state.isLoading,
      state.error,
      initialize,
      login,
      logout,
      register,
      verifyOTP,
      completeSignUp,
      resendOTP,
      forgotPassword,
      reset,
      resetwithtoken,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
