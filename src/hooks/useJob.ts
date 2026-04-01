import { useQuery } from '@tanstack/react-query'

import { getJobById } from '@/api/jobs'

/**
 * Fetches a single job by id for the details page.
 */
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId),
    enabled: Boolean(jobId),
  })
}
