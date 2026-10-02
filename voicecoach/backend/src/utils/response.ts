export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  error?: string
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
})

export const errorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error,
})
