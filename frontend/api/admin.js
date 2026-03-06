import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  
    const admin = data?.admin;
    const token = admin?.token || data?.token;
  
    if (!admin || !token) {
      throw new Error(data?.error || "Login response has no token/admin");
    }
  
    localStorage.setItem("currentAdmin", JSON.stringify({ ...admin, token }));
    localStorage.setItem("token", token);
  
    return { ...admin, token };
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