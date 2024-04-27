import axios from 'axios'

const myAxios = axios.create({
  baseURL: import.meta.env.BASE_API_URL || 'http://localhost:8080/api'
})

export { myAxios }
