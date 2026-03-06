import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPRESS_APP_API_URL || "http://localhost:5001/api",
  withCredentials: true, 
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentAdmin");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
  
    localStorage.setItem("currentAdmin", JSON.stringify(data.admin));
    localStorage.setItem("token", data.admin.token);
  
    return data.admin; 
  };

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentAdmin");
};

export const getAdmin = () => {
  const admin = localStorage.getItem("currentAdmin");
  if (!admin || admin === "undefined" || admin === "null") return null;

  try {
    return JSON.parse(admin);
  } catch (e) {
    console.error("Failed to parse admin from localStorage:", e);
    localStorage.removeItem("currentAdmin");
    return null;
  }
};

export const setAdmin = (admin) => {
  if (admin) localStorage.setItem("currentAdmin", JSON.stringify(admin));
  else localStorage.removeItem("currentAdmin");
};

export const getAdmins = async () => {
  const { data } = await API.get("/auth/admins");
  return data?.admins || [];
};

// (опционально) проверить текущего админа по токену
export const me = async () => {
  const { data } = await API.get("/auth/me");
  return data; // backend вернёт admin (req.user)
};