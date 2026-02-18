import axios from "axios"

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export const getApplications = async () => {
    const { data } = await API.get('/applications');
    return data;
};

export const createApplication = async (applicationData) => {
    const { data } = await API.post('/applications', applicationData);
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


export const getAdmin = () => {
    const user = localStorage.getItem('currentAdmin');
    return user ? JSON.parse(user) : null;
};

export const setAdmin = (admin) => {
    if (admin) {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
    } else {
        localStorage.removeItem('currentAdmin');
    }
};

// Демо-данные для первого запуска
export const initSampleData = () => {
    if (getApplications().length === 0) {
        const sampleBookings = [
            {
                id: 1,
                clientName: 'John Smith',
                phone: '87755920999',
                room: 'H401',
                time: '2026-02-15T14:30:00',
                status: 'new',
                adminId: '',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                clientName: 'Sarah Johnson',
                phone: '87771234567',
                room: 'H402',
                time: '2026-02-16T10:00:00',
                status: 'assigned',
                adminId: 'admin1',
                createdAt: new Date().toISOString()
            }
        ];
        saveBookings(sampleBookings);
    }
};