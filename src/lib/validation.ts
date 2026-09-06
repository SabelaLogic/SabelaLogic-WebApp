// Shared client/server validation so the two layers can't drift out of sync.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export const MAX_LENGTHS = {
  name: 120,
  contact: 120,
  type: 60,
  when: 60,
  brief: 4000,
  email: 254,
} as const;

export function withinMax(value: string, max: number): boolean {
  return value.trim().length <= max;
}
