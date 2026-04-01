import { useQuery } from '@tanstack/react-query'

import { getJobs } from '@/api/jobs'
import type { GetJobsParams } from '@/types/job'

type UseJobsParams = {
  search: string
  isActiveRecruiting: boolean
  sortOrder: 'asc' | 'desc'
}

/**
 * Fetches jobs based on the current server-side search, filter and sort state.
 */
export function useJobs({
  search,
  isActiveRecruiting,
  sortOrder,
}: UseJobsParams) {
  const params: GetJobsParams = {
    search: search.trim() || undefined,
    isActiveRecruiting: isActiveRecruiting ? true : undefined,
    sortOrder,
  }

  return useQuery({
    queryKey: [
      'jobs',
      params.search ?? '',
      !!params.isActiveRecruiting,
      params.sortOrder,
    ],
    queryFn: () => getJobs(params),
  })
}
