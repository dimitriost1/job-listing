import type { GetJobsParams, Job } from '@/types/job'

const JOBS_API_URL = 'https://69a17dae2e82ee536fa15e5d.mockapi.io/api/jobs'

/**
 * Fetches jobs using server-side search, active recruiting filter, and date sorting.
 */
export async function getJobs(params: GetJobsParams = {}): Promise<Job[]> {
  const url = new URL(JOBS_API_URL)

  if (params.search?.trim()) {
    url.searchParams.set('title', params.search.trim())
  }

  if (params.isActiveRecruiting !== undefined) {
    url.searchParams.set(
      'isActiveRecruiting',
      String(params.isActiveRecruiting),
    )
  }

  url.searchParams.set('sortBy', 'publishedAt')
  url.searchParams.set('order', params.sortOrder ?? 'desc')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error('Failed to fetch jobs')
  }

  return (await response.json()) as Job[]
}

/**
 * Fetches a single job by id for the details page.
 */
export async function getJobById(jobId: string): Promise<Job> {
  const response = await fetch(`${JOBS_API_URL}/${jobId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch job details')
  }

  return (await response.json()) as Job
}
