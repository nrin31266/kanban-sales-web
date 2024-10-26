export interface ApiResponse <T = any> {
    code: number
    result?: T
    message?: string
}

export interface PaginationResponse {
    currentPage: number
    totalPages: number
    pageSize: number
    totalElements: number
    data: any[]
  }