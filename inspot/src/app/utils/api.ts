import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Add request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Functions for Clubs
export const clubAPI = {
  getClubs: () => api.get('/clubs'),
  addClub: (clubData: { name: string; location: string; manager_id: number }) => 
    api.post('/clubs', clubData),
};

// API Functions for Slots
export const slotAPI = {
  getSlotsByClub: (clubId: number) => api.get(`/slots/${clubId}`),
  addSlot: (slotData: { club_id: number; time: string; price: number }) => 
    api.post('/slots', slotData),
};

// API Functions for Bookings
export const bookingAPI = {
  createBooking: (bookingData: { user_id: number; slot_id: number }) => 
    api.post('/bookings', bookingData),
  getUserBookings: (userId: number) => api.get(`/bookings/user/${userId}`),
};

// API Functions for Auth
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
};

export default api;
