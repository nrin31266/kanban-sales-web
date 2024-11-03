export interface ApiResponse <T = any> {
    code: number
    result: T
    message?: string
}

export interface PageResponse<T = any> {
    currentPage: number
    totalPages: number
    pageSize: number
    totalElements: number
    data: T[]
  }