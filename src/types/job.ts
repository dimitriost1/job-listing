export type Job = {
  id: string
  title: string
  company: string
  companyAvatar: string
  companyUrl: string
  jobType: string
  department: string
  description: string
  publishedAt: string
  isActiveRecruiting: boolean
}

export type SortOrder = 'asc' | 'desc'

export type GetJobsParams = {
  search?: string
  isActiveRecruiting?: boolean
  sortOrder?: SortOrder
}
