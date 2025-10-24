# 🔐 Enhanced Authentication & Session Management

## ✅ Zaimplementowane funkcjonalności

### 🍪 **Bezpieczne przechowywanie sesji**
- **Cookie httpOnly** dla refresh tokenów (bezpieczne, niedostępne z JS)
- **Secure cookies** z flagami `Secure`, `SameSite=Strict`
- **Automatyczna migracja** z sessionStorage do cookies
- **Token refresh** logic z automatycznym odnawianiem

### 🛡️ **Zaawansowane guardy routingu**  
- **Role-based access control** z uprawnieniami
- **Lepsze przekierowania** z query params
- **Middleware** dla wszystkich chrononych tras
- **Automatic redirect** po zalogowaniu do intended destination

### 📊 **Session monitoring**
- **Activity tracking** z auto-logout po 30 min nieaktywności
- **Token expiry warnings** z automatycznym refresh
- **Debug panel** (tylko development) do monitorowania sesji
- **Composable** `useSession()` dla łatwego zarządzania

## 🧑‍💻 **Struktura plików**

```
src/
├── utils/
│   └── cookies.js              # 🍪 Secure cookie management
├── composables/
│   └── useSession.js           # 📊 Session management composable  
├── router/
│   └── guards.js               # 🛡️ Enhanced route guards
├── components/
│   └── SessionDebug.vue        # 🔍 Debug panel (dev only)
├── store/
│   └── auth.js                 # 🔐 Enhanced auth store
└── router/index.js             # 🛤️ Updated router with guards
```

## 🎯 **Jak używać**

### **1. Sprawdzanie autoryzacji w komponencie**
```vue
<template>
  <div v-if="auth.store.isAuth">
    <p>Zalogowany jako: {{ auth.store.account.email }}</p>
    <button v-if="auth.store.hasPermission('admin')" @click="goToAdmin">
      Panel Admin
    </button>
  </div>
</template>

<script setup>
import { useAuth } from '@/store/auth.js'
const auth = useAuth()
</script>
```

### **2. Zarządzanie sesją**
```vue
<script setup>
import { useSession } from '@/composables/useSession.js'

const session = useSession()

// Initialize session
await session.initializeSession()

// Check session status
console.log('Valid session:', session.hasValidSession.value)
console.log('Token expiring soon:', session.isTokenExpiringSoon.value)

// Refresh session manually
await session.refreshSession()

// Clear session
await session.clearSession()
</script>
```

### **3. Chronione trasy z uprawnieniami**
```javascript
// router/index.js
{
  path: '/admin',
  component: AdminView,
  meta: {
    requiresAuth: true,
    permissions: ['admin'],           // Wymagane uprawnienie 'admin'
    requireAllPermissions: true       // Wymaga WSZYSTKICH uprawnień
  }
},
{
  path: '/quiz/create',
  component: CreateQuizView,
  meta: {
    requiresAuth: true,
    permissions: ['quiz.create', 'quiz.edit'], // Wymaga KTÓREGOKOLWIEK z uprawnień
    requireAllPermissions: false
  }
}
```

### **4. Cookie management**
```javascript
import { authCookies } from '@/utils/cookies.js'

// Set auth tokens
authCookies.setAuthTokens(accessToken, refreshToken)

// Set user data
authCookies.setUserData({ 
  email: 'user@example.com', 
  permissions: ['user', 'quiz.play'] 
})

// Get tokens
const token = authCookies.getAccessToken()
const userData = authCookies.getUserData()

// Clear all
authCookies.clearAuthCookies()
```

## 🔧 **Konfiguracja środowiska**

### **Environment Variables (.env)**
```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# API Configuration  
VITE_API_BASE_URL=http://localhost:3000/api

# Security
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false  # true for production HTTPS
```

## 🚨 **Security Features**

### **Cookie Security**
- ✅ `HttpOnly` flag dla refresh tokenów
- ✅ `Secure` flag w produkcji
- ✅ `SameSite=Strict` przeciwko CSRF  
- ✅ Proper expiry times (15min access, 7d refresh)

### **Session Security**
- ✅ Automatic logout po nieaktywności (30min)
- ✅ Token refresh przed expiry (5min warning)
- ✅ Activity tracking na kluczowych eventach
- ✅ Proper cleanup przy logout

### **Router Security**
- ✅ Guards sprawdzające autentykację i uprawnienia
- ✅ Redirect loops prevention
- ✅ Intended destination preservation
- ✅ Role-based access control

## 🎮 **Development Debug Panel**

W trybie development (npm run dev) pojawi się ikonka 🔐 w prawym dolnym rogu:
- 📊 **Session status** - czy sesja jest aktywna
- ⏰ **Token expiry** - czas do wygaśnięcia  
- 🍪 **Storage type** - cookies vs sessionStorage
- 👤 **User info** - email, uprawnienia
- 🔄 **Manual controls** - refresh token, logout

## 🔄 **Automatyczne funkcje**

### **Auto-refresh tokenów**
- Tokeny są automatycznie odnawiane 5 min przed expiry
- Użytkownik nie widzi przerw w sesji
- Fallback logout jeśli refresh się nie powiedzie

### **Activity monitoring**  
- Track user activity (clicks, moves, scrolls)
- Auto-logout po 30 min nieaktywności
- Update `lastActivity` timestamp

### **Session persistence**
- Sesja przetrwa odświeżenie strony
- Migracja z sessionStorage do cookies
- Backward compatibility z istniejącymi sesjami

## 🧪 **Testowanie**

### **Jak przetestować cookie storage:**
1. Zaloguj się do aplikacji
2. Otwórz DevTools → Application → Cookies
3. Sprawdź czy są `quizapp_token`, `quizapp_user` cookies
4. Odśwież stronę - powinien pozostać zalogowany

### **Jak przetestować guards:**
1. Wejdź na `/admin` bez logowania → przekierowanie na `/login`
2. Zaloguj się → automatyczne przekierowanie na `/admin`
3. Wejdź na `/login` będąc zalogowanym → przekierowanie na `/quiz`

### **Jak przetestować auto-logout:**
1. Zaloguj się
2. Zostaw kartę nieaktywną na 30+ minut
3. Wróć do karty → powinien być wylogowany

## 🚀 **Gotowe do produkcji**

Wszystkie funkcjonalności są gotowe do wdrożenia:
- ✅ Secure cookie storage
- ✅ Advanced route guards  
- ✅ Session monitoring
- ✅ Activity tracking
- ✅ Auto-refresh tokens
- ✅ Role-based access control
- ✅ Debug tools

**Aplikacja spełnia wszystkie wymagania bezpieczeństwa dla sesji i routingu!** 🎉