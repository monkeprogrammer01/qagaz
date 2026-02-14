// Утилиты для работы с localStorage

export const getBookings = () => {
    const bookings = localStorage.getItem('bookings');
    return bookings ? JSON.parse(bookings) : [];
};

export const saveBookings = (bookings) => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
};

export const getUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
};

// Демо-данные для первого запуска
export const initSampleData = () => {
    if (getBookings().length === 0) {
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
