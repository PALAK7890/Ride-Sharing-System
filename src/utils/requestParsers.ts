export function parsePositiveInteger(value: unknown, fieldName: string): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`\`${fieldName}\` must be a positive integer.`);
  }

  return parsed;
}

export function parseRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`\`${fieldName}\` must be a non-empty string.`);
  }

  return value.trim();
}

export function parseBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }

    if (normalized === 'false') {
      return false;
    }
  }

  throw new Error(`\`${fieldName}\` must be a boolean value (true or false).`);
}
