import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
