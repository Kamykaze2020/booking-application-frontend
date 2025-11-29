import axios from "axios";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "", // with CRA proxy, I've added proxy in package.json
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});
