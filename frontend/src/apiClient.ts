import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem("userInfo");
    // console.log("User Info from localStorage:", userInfo);
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      // console.log("Parsed Token:", token);
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;
