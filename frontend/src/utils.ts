import { ApiError } from "./types/ApiError";

export const getError = (err: ApiError) => {
  return err.response && err.response.data.message
    ? err.response.data.message
    : err.message;
};
