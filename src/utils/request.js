import axios from "axios";

const request = axios.create({
  baseURL: 'http://localhost:1009',
  headers: {'Content-Type': 'application/json; charset=utf-8'}
})
request.interceptors.request.use(config => {
    const token = 'Bearer ' + sessionStorage.getItem('token')
    if(token){
      config.headers['Authorization'] = token
    }
   return config
 })
 

export default request