// src/services/api.js
import axios from "axios";
import { useAuth } from "../store/auth.js";

// Konfiguracja bazowa
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enable cookies for session-based auth across CORS
api.defaults.withCredentials = true;

// Request interceptor - dodaje token do nagłówków
api.interceptors.request.use(
  (config) => {
    const { store } = useAuth();
    if (store.token) {
      config.headers.Authorization = `Bearer ${store.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - obsługa błędów
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { logout } = useAuth();

    if (error.response) {
      // Serwer odpowiedział z kodem błędu
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Nieautoryzowany - wyloguj użytkownika
          logout();
          throw new Error("Sesja wygasła. Zaloguj się ponownie.");

        case 403:
          throw new Error("Brak uprawnień do wykonania tej operacji.");

        case 404:
          throw new Error("Nie znaleziono zasobu.");

        case 409:
          // Konflikt - zajęty email lub nick
          throw new Error(data.message || "Email lub nick jest już zajęty.");

        case 422:
          // Błędy walidacji z serwera
          if (data.errors) {
            const messages = Object.values(data.errors).flat();
            throw new Error(messages.join(", "));
          }
          throw new Error(data.message || "Błąd walidacji danych.");

        case 429:
          throw new Error("Zbyt wiele żądań. Spróbuj ponownie za chwilę.");

        case 500:
          throw new Error("Błąd serwera. Spróbuj ponownie później.");

        default:
          throw new Error(data.message || `Błąd HTTP ${status}`);
      }
    } else if (error.request) {
      // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi
      throw new Error(
        "Brak połączenia z serwerem. Sprawdź połączenie internetowe."
      );
    } else {
      // Błąd w konfiguracji żądania
      throw new Error(error.message || "Nieznany błąd");
    }
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  loginWithGoogle: (data) => api.post("/auth/google", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const quizAPI = {
  getQuizzes: () => api.get("/quizzes"),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (data) => api.post("/quizzes", data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

export const rankingAPI = {
  getRanking: () => api.get("/ranking"),
  submitScore: (data) => api.post("/ranking", data),
};

export default api;
