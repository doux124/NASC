import clsx from 'clsx'
import { COLORS } from './tokens'

export const cn = (...args) => clsx(...args)

export const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

export const scoreColor = (score) => {
  if (score >= 0.4) return COLORS.accent
  if (score >= 0.2) return COLORS.orange
  return COLORS.teal
}

export const formatNumber = (n, digits = 3) =>
  typeof n === 'number' && Number.isFinite(n) ? n.toFixed(digits) : '—'
