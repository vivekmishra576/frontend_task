export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusBadgeClass = (status?: string | null): string => {
  if (!status) return 'badge-draft';
  switch (status.toLowerCase()) {
    case 'live':
    case 'published':
      return 'badge-live';
    case 'draft':
      return 'badge-draft';
    default:
      return 'badge-draft';
  }
};
