import axios, { AxiosRequestConfig } from 'axios'
import env from '../src/config/env'

const useAxiosConfig = (config?: AxiosRequestConfig) => {
  const axiosClient = axios.create({
    baseURL: env.VITE_API_URL,
    withCredentials: true,
    ...config,
    headers: {
      'Content-type': 'application/json',
      ...config?.headers
    }
  })

  return axiosClient
}

export default useAxiosConfig
