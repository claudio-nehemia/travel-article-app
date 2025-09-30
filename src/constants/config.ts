export const API_BASE_URL = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app';
export const PAGINATION = {
    PAGE_SIZE: 9,
} as const;

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'title:asc', label: 'Title A-Z' },
  { value: 'title:desc', label: 'Title Z-A' },
] as const;