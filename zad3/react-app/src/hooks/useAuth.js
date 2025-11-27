import { useState } from 'react'
import { apiCall } from '../utils/api'
import { setTokens, clearTokens } from '../utils/storage'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      const data = await apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })

      if (data.error) {
        throw new Error(data.error)
      }

      // Store tokens
      setTokens(data.accessToken, data.refreshToken)
      setUser({ role: data.role, username })
      return true
    } catch (e) {
      console.error('Login failed:', e)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  return { user, loading, login, logout }
}
