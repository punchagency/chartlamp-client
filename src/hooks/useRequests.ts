
import axiosInstance from '@/lib/axios';
import { Reducer, useCallback, useReducer } from 'react';

// Define action types
const actionTypes = {
  REQUEST_START: 'REQUEST_START',
  REQUEST_SUCCESS: 'REQUEST_SUCCESS',
  REQUEST_FAILURE: 'REQUEST_FAILURE',
} as const;

type ActionTypes = typeof actionTypes[keyof typeof actionTypes];

// Define the initial state
interface State<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

const initialState: State<any> = {
  data: null,
  loading: false,
  error: null,
};

// Define the action interfaces
interface RequestStartAction {
  type: typeof actionTypes.REQUEST_START;
}

interface RequestSuccessAction<T> {
  type: typeof actionTypes.REQUEST_SUCCESS;
  payload: T;
}

interface RequestFailureAction {
  type: typeof actionTypes.REQUEST_FAILURE;
  payload: any;
}

type Action<T> = RequestStartAction | RequestSuccessAction<T> | RequestFailureAction;

// Define the reducer function
const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case actionTypes.REQUEST_START:
      return { ...state, loading: true, error: null };
    case actionTypes.REQUEST_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case actionTypes.REQUEST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Custom hook to handle different HTTP requests
export const useHttpRequest = <T>() => {
  const [state, dispatch] = useReducer<Reducer<State<T>, Action<T>>>(reducer, initialState);

  const sendRequest = useCallback(async (method: string, endpoint: string, data: any = null) => {
    const controller = new AbortController();
    const { signal } = controller;

    dispatch({ type: actionTypes.REQUEST_START });

    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        signal,
      });
      dispatch({ type: actionTypes.REQUEST_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: actionTypes.REQUEST_FAILURE, payload: error });
    }

    return () => controller.abort();
  }, []);

  return {
    ...state,
    sendRequest,
  };
};

// Usage examples for different HTTP methods
export const useGetRequests = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();

  const getRequests = useCallback((endpoint: string, params: any = {}) => {   
    return sendRequest('get', endpoint, { params });
  }, [sendRequest]);

  return { data, loading, error, getRequests };
};

export const usePostRequests = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();
  const postRequests = useCallback((endpoint: string, data: any) => sendRequest('post', endpoint, data), [sendRequest]);

  return { data, loading, error, postRequests };
};

export const usePutRequests = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();
  const putRequests = useCallback((endpoint: string, data: any) => sendRequest('put', endpoint, data), [sendRequest]);

  return { data, loading, error, putRequests };
};

export const usePatchRequests = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();
  const patchRequests = useCallback((endpoint: string, data: any) => sendRequest('patch', endpoint, data), [sendRequest]);

  return { data, loading, error, patchRequests };
};

export const useDeleteRequests = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();
  const deleteRequests = useCallback((endpoint: string) => sendRequest('delete', endpoint), [sendRequest]);

  return { data, loading, error, deleteRequests };
};

//use upload file
export const useUploadFile = <T>() => {
  const { data, loading, error, sendRequest } = useHttpRequest<T>();
  const uploadFile = useCallback((endpoint: string, data: any) => sendRequest('post', endpoint, data), [sendRequest]);

  return { data, loading, error, uploadFile };
};