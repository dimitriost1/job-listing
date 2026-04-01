import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { useJobs } from '@/hooks/useJobs'
import type { SortOrder } from '@/types/job'

export const Route = createFileRoute('/')({ component: JobListPage })

const PAGE_SIZE = 10

function JobListPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isActiveRecruiting, setIsActiveRecruiting] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useJobs({
    search: debouncedSearch,
    isActiveRecruiting,
    sortOrder,
  })

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE)
  const visibleJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetPage() {
    setPage(1)
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {jobs.length} positions found
        </Typography>
      </Box>

      {/* Filters */}
      <Stack spacing={2}>
        <TextField
          placeholder="Search by job title…"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            resetPage()
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort by date</InputLabel>
            <Select
              label="Sort by date"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as SortOrder)
                resetPage()
              }}
            >
              <MenuItem value="desc">Newest first</MenuItem>
              <MenuItem value="asc">Oldest first</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={isActiveRecruiting}
                onChange={(e) => {
                  setIsActiveRecruiting(e.target.checked)
                  resetPage()
                }}
              />
            }
            label="Actively Recruiting"
          />
        </Stack>
      </Stack>

      {/* Content */}
      {isLoading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          Something went wrong while loading jobs. Please try again.
        </Alert>
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No jobs found matching your criteria.
        </Typography>
      )}

      {!isLoading && !isError && visibleJobs.length > 0 && (
        <Stack spacing={2}>
          {visibleJobs.map((job) => (
            <Link
              key={job.id}
              to="/jobs/$jobId"
              params={{ jobId: job.id }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Typography fontWeight="bold">{job.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company} · {job.department}
                </Typography>
              </Paper>
            </Link>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, value) => setPage(value)}
          />
        </Box>
      )}
    </Stack>
  )
}
