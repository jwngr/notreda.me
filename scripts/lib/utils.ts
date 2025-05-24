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
  const response = await fetch(`${url}?${new URLSearchParams(params)}`, {method, headers});

  if (!response.ok) {
    throw new Error(`Failed to fetch url "${url}": ${JSON.stringify(response.statusText)}`);
  }

  return response.json() as Promise<T>;
}
