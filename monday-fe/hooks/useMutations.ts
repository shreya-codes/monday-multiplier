import { useState } from 'react'
import useAxiosConfig from './useAxiosConfig'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { IMutationOptions, IAxiosResponseType } from '../src/types/axiosParams'

const useMutation = () => {
  const axiosInstance = useAxiosConfig()
  const [isMutating, setIsMutating] = useState(false)
  const [isError, setIsError] = useState(false)
  const [responseData, setResponseData] = useState<IAxiosResponseType>()

  const mutate = async ({
    options,
    onSuccess,
    onError,
    onSettled,
  }: IMutationOptions): Promise<AxiosResponse | undefined> => {
    setIsMutating(true)

    try {
      const response = (await axiosInstance(
        options as AxiosRequestConfig
      )) as AxiosResponse
      setIsError(false)
      setResponseData(response)
      await onSuccess?.(response)
      return response
    } catch (error) {
      const errorResponse = error as AxiosError<{
        message: string
        error: string
      }>
      setIsError(true)
      setResponseData(errorResponse.response)
      await onError?.(errorResponse)
      return errorResponse.response
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500))
      await onSettled?.(responseData!)
      setIsMutating(false)
    }
  }

  const postRequest = (url: string, args: IMutationOptions) => {
    mutate({
      ...args,
      options: {
        url,
        method: 'POST',
        ...args.options
      }
    })
  }
  
  const putRequest = async <T = any>(url: string, args: IMutationOptions): Promise<T | undefined> => {
    try {
      const response = await mutate({
        ...args,
        options: {
          url,
          method: 'PUT',
          ...args.options
        }
      });
      console.log("response", response);
      if (!response) {
        return undefined;
      }
      
      // If it's an error response, return the error data
      if (response.status >= 400) {
        return response.data as T;
      }
      
      return response.data as T;
    } catch (error) {
      console.error('Error in putRequest:', error);
      return undefined;
    }
  }

  const patchRequest = (url: string, args: IMutationOptions) => {
    mutate({
      ...args,
      options: {
        url,
        method: 'PATCH',
        ...args.options
      }
    })
  }

  const deleteRequest = (url: string, args: IMutationOptions) => {
    mutate({
      ...args,
      options: {
        url,
        method: 'DELETE',
        ...args.options
      }
    })
  }

  return {
    deleteRequest,
    postRequest,
    patchRequest,
    putRequest,
    isMutating,
    isError,
    responseData
  }
}

export default useMutation
