import {QueryParams} from '../../website/src/models/utils.models';

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

export const withCommas = (value: number): string => {
  if (typeof value !== 'number') {
    throw new Error(`Expected a number, but got ${value} of type "${typeof value}".`);
  }

  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const makeId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getGameDate = ({
  date,
  time,
  fullDate,
}: {
  readonly date?: string;
  readonly time?: string;
  readonly fullDate?: string;
}): Date => {
  let d: Date | undefined;
  if (fullDate) {
    d = new Date(fullDate);
  } else if (date && time) {
    d = time ? new Date(date + ' ' + time) : new Date(date);
  } else {
    throw new Error('Invalid game date.');
  }

  return d;
};

export const getGameTimestampInSeconds = ({
  date,
  time,
  fullDate,
}: {
  readonly date?: string;
  readonly time?: string;
  readonly fullDate?: string;
}): number => {
  const d = getGameDate({date, time, fullDate});
  return d.getTime() / 1000;
};

export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val);
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val !== '';
}

export function getPossessionInSeconds(possession: string): number {
  const [minutes, seconds] = possession.split(':');
  return Number(minutes) * 60 + Number(seconds);
}

interface FetchUrlOptions {
  readonly url: string;
  readonly method: 'GET' | 'POST';
  readonly params?: QueryParams;
  readonly headers?: Record<string, string>;
}

export async function fetchUrl<T>({
  url,
  params = {},
  method = 'GET',
  headers = {},
}: FetchUrlOptions): Promise<T> {
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
    method,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch url: ${url}`);
  }

  return response.json() as Promise<T>;
}
