import axios from 'axios'

const myAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api` || 'http://localhost:8080/api',
})

const authAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api` || 'http://localhost:8080/api',
  withCredentials: true,
  withXSRFToken: true
})

export { myAxios, authAxios }
