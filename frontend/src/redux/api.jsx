import axios from 'axios'

const api = axios.create({
  baseURL: "http://3.36.125.122:8082",
  headers: {
    "Content-Type": "application/json;charset-utf-8"
  },
  withCredentials:true
})

export default api;
