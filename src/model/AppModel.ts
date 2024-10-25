export interface ApiResponse {
    code: number
    result?: any
    message?: string
}

export interface PaginationResponse {
    currentPage: number
    totalPages: number
    pageSize: number
    totalElements: number
    data: any[]
  }