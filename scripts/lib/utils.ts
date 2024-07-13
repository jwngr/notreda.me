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
  readonly date: string;
  readonly time: string;
  readonly fullDate: string;
}): Date => {
  let d;
  if (fullDate) {
    d = new Date(fullDate);
  } else if (time) {
    d = new Date(date + ' ' + time);
  } else {
    d = new Date(date);
  }

  return d;
};

export const getGameTimestampInSeconds = ({
  date,
  time,
  fullDate,
}: {
  readonly date: string;
  readonly time: string;
  readonly fullDate: string;
}): number => {
  const d = getGameDate({date, time, fullDate});
  return d.getTime() / 1000;
};

export const isNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !isNaN(val);
};

export const isString = (val: unknown): val is string => {
  return typeof val === 'string';
};

export const isNonEmptyString = (val: unknown): val is string => {
  return typeof val === 'string' && val !== '';
};

export const getPossessionInSeconds = (possession: string): number => {
  const [minutes, seconds] = possession.split(':');
  return Number(minutes) * 60 + Number(seconds);
};
