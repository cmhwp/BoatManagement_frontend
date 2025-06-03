// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// 分页查询参数
export interface PaginationQuery {
  page?: number
  size?: number
}

// API响应基础结构
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
}

// 选项接口
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// 表格列配置
export interface TableColumn {
  title: string
  dataIndex: string
  key: string
  width?: number
  align?: 'left' | 'center' | 'right'
  sorter?: boolean
  fixed?: 'left' | 'right'
}

// 面包屑导航
export interface BreadcrumbItem {
  title: string
  path?: string
}
