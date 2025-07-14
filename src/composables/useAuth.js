import { ref, computed } from 'vue'
import { API_ENDPOINTS, createApiRequest, createAuthenticatedRequest } from '@/config/api'

const user = ref(null)
const token = ref(localStorage.getItem('auth_token') || null)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('auth_user')
    if (token.value && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        clearAuth()
      }
    }
  }

  const setAuth = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const login = async (email, password) => {
    try {
      const response = await createApiRequest(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({
          auth: {
            email,
            password
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuth(data.user, data.token)
        return data
      } else {
        throw new Error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Network error occurred. Please try again.')
    }
  }

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await createApiRequest(API_ENDPOINTS.register, {
        method: 'POST',
        body: JSON.stringify({
          auth: {
            first_name: firstName,
            last_name: lastName,
            email,
            password
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAuth(data.user, data.token)
        return data
      } else {
        throw new Error(data.errors ? data.errors.join(', ') : 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error(error.message || 'Network error occurred. Please try again.')
    }
  }

  const logout = async () => {
    try {
      clearAuth()
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
    }
  }

  const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    if (!token.value) {
      throw new Error('No authentication token available')
    }

    return createAuthenticatedRequest(endpoint, token.value, options)
  }

  if (token.value && !user.value) {
    initializeAuth()
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    login,
    register,
    logout,
    clearAuth,
    makeAuthenticatedRequest
  }
}
