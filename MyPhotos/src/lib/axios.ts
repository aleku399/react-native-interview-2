import axios, {AxiosInstance} from 'axios';
import {baseURL} from '../Constants';

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

class HttpError extends Error {
  public status: number;

  constructor(message: string, status?: number) {
    super();
    this.name = 'HTTP Error';
    this.status = status as number;
    this.message = status ? `${message} with status: ${status}` : message;
  }
}

export function authAxios(): AxiosInstance {
  return instance;
}

export interface JsonError {
  message: string;
  status: number;
}

export interface ApiData<T> {
  data: T;
  loading: boolean;
  error: string;
}

// TODO make it return AxiosResponse<ApiData>
instance.interceptors.response.use(
  response => response,
  error => {
    const jsonError: JsonError = error && error.response && error.response.data;
    const errorMsg = (jsonError && jsonError.message) || error.toString();
    const status = jsonError && jsonError.status;
    return Promise.reject(new HttpError(errorMsg, status));
  },
);

export default instance;
