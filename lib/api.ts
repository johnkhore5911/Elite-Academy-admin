import axios from "axios"

// Create a base API instance
const api = axios.create({
  baseURL: "https://elite-academy-ebon.vercel.app/api",
})

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token")

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { api }
