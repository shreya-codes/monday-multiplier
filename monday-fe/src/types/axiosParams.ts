import { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios"


 interface IAxiosParams {
    params?: Record<string, any>
    headers?: AxiosRequestHeaders
  }
  type IAxiosResponseType = AxiosResponse | AxiosError

  interface IMutationOptions {
    options?: AxiosRequestConfig
    onSuccess?: (data?: AxiosResponse) => void | Promise<void>
    onError?: (error?: AxiosError) => void | Promise<void>
    onSettled?: (data?: IAxiosResponseType) => void | Promise<void>
    successMessage?: string
  }

  export type {IAxiosParams,IMutationOptions,IAxiosResponseType }