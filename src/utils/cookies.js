// src/utils/cookies.js
// Utility functions for secure cookie management

export const cookieUtils = {
  // Set cookie with security flags
  set(name, value, options = {}) {
    const defaults = {
      path: '/',
      secure: location.protocol === 'https:',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days default
    }
    
    const config = { ...defaults, ...options }
    
    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (config.maxAge) cookieString += `; Max-Age=${config.maxAge}`
    if (config.expires) cookieString += `; Expires=${config.expires.toUTCString()}`
    if (config.path) cookieString += `; Path=${config.path}`
    if (config.domain) cookieString += `; Domain=${config.domain}`
    if (config.secure) cookieString += `; Secure`
    if (config.httpOnly) cookieString += `; HttpOnly`
    if (config.sameSite) cookieString += `; SameSite=${config.sameSite}`
    
    document.cookie = cookieString
  },

  // Get cookie value
  get(name) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=')
      if (cookieName === name) {
        return decodeURIComponent(cookieValue)
      }
    }
    return null
  },

  // Remove cookie
  remove(name, options = {}) {
    this.set(name, '', { 
      ...options, 
      maxAge: -1 
    })
  },

  // Check if cookie exists
  exists(name) {
    return this.get(name) !== null
  }
}

// Specific auth cookie management
export const authCookies = {
  TOKEN_KEY: 'quizapp_token',
  REFRESH_TOKEN_KEY: 'quizapp_refresh',
  USER_KEY: 'quizapp_user',

  setAuthTokens(accessToken, refreshToken, options = {}) {
    const tokenOptions = {
      maxAge: 15 * 60, // Access token: 15 minutes
      secure: true,
      httpOnly: false, // Needs to be accessible by JS for API calls
      sameSite: 'Strict',
      ...options
    }

    const refreshOptions = {
      maxAge: 7 * 24 * 60 * 60, // Refresh token: 7 days
      secure: true,
      httpOnly: true, // HttpOnly for security
      sameSite: 'Strict',
      ...options
    }

    cookieUtils.set(this.TOKEN_KEY, accessToken, tokenOptions)
    cookieUtils.set(this.REFRESH_TOKEN_KEY, refreshToken, refreshOptions)
  },

  setUserData(userData, options = {}) {
    const userOptions = {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      httpOnly: false, // Needs to be accessible by JS
      sameSite: 'Strict',
      ...options
    }

    cookieUtils.set(this.USER_KEY, JSON.stringify(userData), userOptions)
  },

  getAccessToken() {
    return cookieUtils.get(this.TOKEN_KEY)
  },

  getUserData() {
    const userData = cookieUtils.get(this.USER_KEY)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (e) {
        console.error('Error parsing user data from cookie:', e)
        return null
      }
    }
    return null
  },

  clearAuthCookies() {
    cookieUtils.remove(this.TOKEN_KEY)
    cookieUtils.remove(this.REFRESH_TOKEN_KEY)
    cookieUtils.remove(this.USER_KEY)
  },

  hasValidSession() {
    return this.getAccessToken() !== null && this.getUserData() !== null
  }
}