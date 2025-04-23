import useAxiosConfig from './useAxiosConfig'
import { IAxiosParams } from '../src/types/axiosParams'

//A reusable hook to make GET requests.
const useFetcher = <T = any>(options?: IAxiosParams) => {
  const axiosInstance = useAxiosConfig()

  const fetcher = async (endpoint: string, requestOptions?: IAxiosParams): Promise<T> => {
    const response = await axiosInstance.get<T>(endpoint, {
      headers: { ...options?.headers, ...requestOptions?.headers },
      params: { ...options?.params, ...requestOptions?.params }
    })
    return response.data
  }

  return { fetcher }
}

export default useFetcher
