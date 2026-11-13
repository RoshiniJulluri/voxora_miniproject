// Mock user accounts – used by authService in development
// Remove this file when real backend authentication is connected

export const mockUsers = [
  {
    id:        'u-001',
    name:      'Alex Johnson',
    email:     'alex@example.com',
    password:  'password123',   // never expose real passwords – mock only
    avatar:    'https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Johnson',
    category:  'student',
    level:     'intermediate',
    language:  'en',
    onboarded: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id:        'u-002',
    name:      'Sarah Chen',
    email:     'sarah@example.com',
    password:  'password123',
    avatar:    'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Chen',
    category:  'professional',
    level:     'advanced',
    language:  'en',
    onboarded: true,
    createdAt: '2024-02-20T08:00:00Z',
  },
  {
    id:        'u-003',
    name:      'Demo User',
    email:     'demo@voxora.ai',
    password:  'demo1234',
    avatar:    'https://api.dicebear.com/7.x/initials/svg?seed=Demo%20User',
    category:  null,
    level:     null,
    language:  'en',
    onboarded: false,
    createdAt: '2024-03-01T12:00:00Z',
  },
]
