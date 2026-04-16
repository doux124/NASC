// Design tokens — mirrored in tailwind.config.js for JS consumers (Recharts, etc.)
export const COLORS = {
  accent: '#e4006a',
  accent2: '#ff4b8b',
  orange: '#ff6b35',
  teal: '#00d4a8',
  purple: '#7c5cfc',
  amber: '#ffb547',
  muted: '#5a5a80',
  muted2: '#8888aa',
  border: '#1c1c35',
  borderStrong: '#252545',
  surface0: '#07070f',
  surface1: '#0d0d1c',
  surface2: '#131326',
}

export const ACTION_CLASS = {
  'Feature Scaling': 'tag-scale',
  'Drop Feature': 'tag-drop',
  'Seasonality Matching': 'tag-seasonal',
  'No Action': 'tag-none',
}

export const TYPE_CLASS = {
  Float: 'text-brand-teal',
  Int: 'text-brand-purple',
  Object: 'text-brand-orange',
}
