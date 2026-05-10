export function formatRelativeTime(value) {
  if (!value) return 'Just now';

  const date = new Date(value);
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return 'Just now';
}

export function getInitials(value) {
  if (!value) return 'ML';

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

// Returns a Tailwind gradient pair for avatar backgrounds
const AVATAR_GRADIENTS = [
  { from: '#0f766e', to: '#0d9488' },   // teal
  { from: '#f97316', to: '#fb923c' },   // orange
  { from: '#7c3aed', to: '#a78bfa' },   // violet
  { from: '#0284c7', to: '#38bdf8' },   // sky
  { from: '#be123c', to: '#fb7185' },   // rose
  { from: '#0f766e', to: '#f97316' },   // teal-orange
];

export function getAvatarGradient(value) {
  if (!value) return AVATAR_GRADIENTS[0];
  const str = String(value);
  const hash = [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}