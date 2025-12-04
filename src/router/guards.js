// src/router/guards.js
// Enhanced route guards with role-based access control

import { useAuth } from '../store/auth.js'
import { useErrors } from '../store/errors.js'

// Check if user has required permissions for a route
function hasRequiredPermissions(to, auth) {
  const requiredPermissions = to.meta.permissions
  const requiredRoles = to.meta.roles
  
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAll = to.meta.requireAllPermissions !== false // default to true
    
    if (hasAll) {
      return auth.store.hasAllPermissions(requiredPermissions)
    } else {
      return auth.store.hasAnyPermission(requiredPermissions)
    }
  }
  
  if (requiredRoles && requiredRoles.length > 0) {
    // Simple role check (you can extend this based on your role system)
    const userRoles = auth.store.account?.roles || []
    return requiredRoles.some(role => userRoles.includes(role))
  }
  
  return true
}

// Main authentication guard
export async function authGuard(to, from, next) {
  const auth = useAuth()
  const errorStore = useErrors()
  
  try {
    // Ensure session is loaded
    const isAuthenticated = await auth.ensureSession()
    
    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      if (!isAuthenticated) {
        // Store the intended destination
        const redirectPath = to.fullPath !== '/' ? to.fullPath : '/home'
        
        next({
          path: '/login',
          query: { redirect: redirectPath },
          replace: true
        })
        return
      }
      
      // Check permissions if authenticated
      if (!hasRequiredPermissions(to, auth)) {
        errorStore.showError('Brak uprawnień do tej strony')
        next({
          path: from.path || '/',
          replace: true
        })
        return
      }
    }
    
    // Redirect authenticated users away from login/register pages
    if ((to.name === 'login' || to.name === 'register' || to.name === 'root') && isAuthenticated) {
      const redirectTo = to.query.redirect || '/home'
      next({
        path: redirectTo,
        replace: true
      })
      return
    }
    
    // Check for maintenance mode
    if (to.meta.maintenance && !auth.store.hasPermission('admin')) {
      next({
        path: '/maintenance',
        replace: true
      })
      return
    }
    
    next()
    
  } catch (error) {
    console.error('Auth guard error:', error)
    errorStore.showError('Błąd podczas sprawdzania autoryzacji')
    
    // On error, redirect to login
    next({
      path: '/login',
      replace: true
    })
  }
}

// Guest-only guard (for login/register pages)
export async function guestGuard(to, from, next) {
  const auth = useAuth()
  
  try {
    const isAuthenticated = await auth.ensureSession()
    
    if (isAuthenticated) {
      const redirectTo = to.query.redirect || '/home'
      next({
        path: redirectTo,
        replace: true
      })
    } else {
      next()
    }
  } catch (error) {
    console.error('Guest guard error:', error)
    next()
  }
}

// Admin-only guard
export function adminGuard(to, from, next) {
  const auth = useAuth()
  
  if (!auth.store.isAuth) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  if (!auth.store.hasPermission('admin')) {
    const errorStore = useErrors()
    errorStore.showError('Wymagane uprawnienia administratora')
    next({
      path: '/',
      replace: true
    })
    return
  }
  
  next()
}

// Optional: Log route access for analytics/security
export function logRouteAccess(to, from, next) {
  const auth = useAuth()
  
  // Log route access (you can send this to your analytics/logging service)
  console.log(`Route access: ${to.path}`, {
    user: auth.store.account?.email,
    timestamp: new Date().toISOString(),
    from: from.path,
    userAgent: navigator.userAgent
  })
  
  next()
}