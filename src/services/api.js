// src/services/api.js
import axios from "axios";
import { useAuth } from "../store/auth.js";
import { useErrors } from "../store/errors.js";

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
    const errorStore = useErrors();
    let message = "Nieznany blad";

    if (error.response) {
      // Serwer odpowiedzial z kodem bledu
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Nieautoryzowany - wyloguj uzytkownika
          logout();
          message = "Sesja wygasla. Zaloguj sie ponownie.";
          break;

        case 403:
          message = "Brak uprawnien do wykonania tej operacji.";
          break;

        case 404:
          message = (data && data.message) || "Nie znaleziono zasobu.";
          break;

        case 409:
          // Konflikt - zajety email lub nick
          message = data.message || "Email lub nick jest juz zajety.";
          break;

        case 422:
          // Bledy walidacji z serwera
          if (data.errors) {
            const messages = Object.values(data.errors).flat();
            message = messages.join(", ");
            break;
          }
          message = data.message || "Blad walidacji danych.";
          break;

        case 429:
          message = "Zbyt wiele zadan. Sprobuj ponownie za chwile.";
          break;

        case 500:
          message = (data && data.message) || "Blad serwera. Sprobuj ponownie pozniej.";
          break;

        default:
          message = data.message || `Blad HTTP ${status}`;
          break;
      }
    } else if (error.request) {
      // Zadanie zostalo wyslane, ale nie otrzymano odpowiedzi
      message = "Brak polaczenia z serwerem. Sprawdz polaczenie internetowe.";
    } else {
      // Blad w konfiguracji zadania
      message = error.message || "Nieznany blad";
    }

    if (!error.config?.suppressGlobalError) {
      errorStore.showError(message);
    }

    return Promise.reject(new Error(message));
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
  getMyQuizzes: () => api.get("/quizzes/mine"),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  answerQuiz: (id, data) => api.post(`/quizzes/${id}/answer`, data),
  createQuiz: (data) => api.post("/quizzes", data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

export const rankingAPI = {
  getRanking: (params) => api.get("/ranking", { params }),
  submitScore: (data) => api.post("/ranking", data),
};

export default api;
