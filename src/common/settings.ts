import { Clock } from './clock.js';

export const APP_SETTINGS = Symbol('APP_SETTINGS');

export interface AppSettings {
  maxPageSize: number;
  bootedAt: Date;
}

export function loadAppSettings(now: Clock): AppSettings {
  const raw = process.env.MAX_PAGE_SIZE;
  if (raw === undefined) return { maxPageSize: 50, bootedAt: now() };

  const maxPageSize = Number(raw);
  if (!Number.isInteger(maxPageSize) || maxPageSize < 1) {
    throw new Error(`MAX_PAGE_SIZE must be a positive integer, got: "${raw}"`);
  }
  return { maxPageSize, bootedAt: now() };
}
