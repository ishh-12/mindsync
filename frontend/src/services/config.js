const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

const defaultApiOrigin = "http://localhost:5000";

export const API_ORIGIN = trimTrailingSlash(process.env.REACT_APP_API_URL) || defaultApiOrigin;
export const SOCKET_ORIGIN =
  trimTrailingSlash(process.env.REACT_APP_SOCKET_URL) || API_ORIGIN;
export const BASE_URL = `${API_ORIGIN}/api`;
