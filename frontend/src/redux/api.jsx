import axios from 'axios'

const api = axios.create({
  baseURL: "https://k8s101.p.ssafy.io/be",
  headers: {
    "Content-Type": "application/json;charset-utf-8"
  },
  withCredentials:true
})

export default api;
