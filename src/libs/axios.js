import axios from 'axios'

// Load environment variables from the .env file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN
const NETWORK = process.env.REACT_APP_NETWORK

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    Network: NETWORK,
    Accept: 'application/json'
  }
})

export const ApiRequestHandle = async (url, method, config = {}) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      ...config // Spread the config to include any additional options
    })

    return response.data // Return the data from the response
  } catch (err) {
    return (
      err.response?.data ?? {
        success: false,
        message: err.code === 'ECONNABORTED' ? 'Network error, check internet connection.' : err.message
      }
    )
  }
}

// Function to handle status messages (could be replaced by a toast/notification system)
const displayStatusMessage = message => {
  console.log(message) // You can replace this with your notification logic
}

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Example: Showing a "Loading" message before sending the request
    displayStatusMessage('Loading...')
    return config
  },
  error => {
    // Handle the request error here
    displayStatusMessage('Request error occurred.')
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Handle success statuses
    if (response.status >= 200 && response.status < 300) {
      displayStatusMessage('Success!') // Customize this message as needed
    }
    return response
  },
  error => {
    // Handle different error statuses
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400:
          displayStatusMessage('Bad Request. Please check your input.')
          break
        case 401:
          displayStatusMessage('Unauthorized. Please log in.')
          break
        case 403:
          displayStatusMessage('Forbidden. You do not have permission.')
          break
        case 404:
          displayStatusMessage('Not Found. The resource does not exist.')
          break
        case 500:
          displayStatusMessage('Internal Server Error. Please try again later.')
          break
        default:
          displayStatusMessage(`Error: ${status} - ${error.response.statusText}`)
      }
    } else if (error.request) {
      // Handle the case where no response was received
      displayStatusMessage('No response received from the server.')
    } else {
      // Handle other errors
      displayStatusMessage(`Error: ${error.message}`)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
