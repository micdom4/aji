// Helper function to make API calls with JWT token handling
export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  })

  // If 401 (unauthorized), token expired
  if (response.status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API call failed')
  }

  return data
}
