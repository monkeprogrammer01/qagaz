import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPRESS_APP_API_URL,
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

export const getApplications = async (params) => {
  const { data } = await API.get("/applications", { params });
  return data;
};

export const createApplication = async (applicationData) => {
  const { data } = await API.post("/applications", applicationData);
  return data;
};

export const updateApplication = async (id, updateData) => {
  const { data } = await API.patch(`/applications/${id}`, updateData);
  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await API.delete(`/applications/${id}`);
  return data;
};

export const initSampleData = async () => {
  try {
    const apps = await getApplications();
    if (Array.isArray(apps) && apps.length > 0) return apps;

    const samples = [
      {
        clientName: "John Smith",
        phone: "87755920999",
        room: "H401",
        time: "2026-02-15T14:30:00.000Z",
      },
      {
        clientName: "Sarah Johnson",
        phone: "87771234567",
        room: "H402",
        time: "2026-02-16T10:00:00.000Z",
      },
    ];

    for (const s of samples) {
      await createApplication(s);
    }

    return await getApplications();
  } catch (e) {
    console.error("initSampleData failed:", e);
    return [];
  }
};

export default API;