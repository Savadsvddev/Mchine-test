import axios from "axios";
import { toast } from "react-toastify";

// ✅ Axios instance setup
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 20000,
});

// ✅ Request interceptor: attach token + content-type
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor: logout on 401
axiosInstance.interceptors.response.use(
  (response) => response, // pass through successful response
  (error) => {
    console.log("error", error);
    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      // Token expired or invalid
      toast.warn("Unauthorized: Logging out...");

      // Clear local storage
      localStorage.removeItem("authToken");

      // Optionally clear other user data
      

      // Redirect to login page (adjust path as needed)
      window.location.href = "/signup";
    }

    // Forward the error to the calling function
    return Promise.reject(error);
  }
);

export default axiosInstance;
