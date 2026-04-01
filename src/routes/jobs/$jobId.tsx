import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import { useJob } from '@/hooks/useJob'

export const Route = createFileRoute('/jobs/$jobId')({
  component: JobDetailsPage,
})

function JobDetailsPage() {
  const { jobId } = Route.useParams()
  const { data: job, isLoading, isError } = useJob(jobId)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !job) {
    return (
      <Stack spacing={2}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          size="small"
        >
          Back to jobs
        </Button>
        <Alert severity="error">
          Failed to load job details. Please try again.
        </Alert>
      </Stack>
    )
  }

  const postedDate = new Date(job.publishedAt).toLocaleDateString()

  return (
    <Stack spacing={3}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to jobs
      </Button>

      {/* Job header */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={job.companyAvatar}
          alt={job.company}
          sx={{ width: 56, height: 56 }}
        />

        <Box>
          <Typography variant="h5" fontWeight="bold">
            {job.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job.company} · {job.department} · {job.jobType}
          </Typography>
          <Stack direction="row" spacing={1} mt={0.5}>
            {job.isActiveRecruiting && (
              <Chip
                label="Actively Recruiting"
                color="primary"
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      </Stack>

      <Divider />

      {/* Meta info */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Posted {postedDate}
          </Typography>
        </Stack>

        {job.companyUrl && (
          <Button
            href={job.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<OpenInNewIcon />}
          >
            Company website
          </Button>
        )}
      </Stack>

      {/* Description */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" whiteSpace="pre-line">
          {job.description}
        </Typography>
      </Box>

      {/* Details card */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Details
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <DetailItem label="Job ID" value={job.id} />
            <DetailItem label="Department" value={job.department} />
            <DetailItem label="Job Type" value={job.jobType} />
            <DetailItem
              label="Actively Recruiting"
              value={job.isActiveRecruiting ? 'Yes' : 'No'}
            />
            <DetailItem label="Posted" value={postedDate} />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}
