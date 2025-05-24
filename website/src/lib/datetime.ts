export function getDateFromGame(args: {
  readonly date?: string;
  readonly time?: string;
  readonly fullDate?: string;
}): Date | 'TBD' | undefined {
  const {date, time, fullDate} = args;

  if (fullDate) {
    return new Date(fullDate);
  }

  if (date === 'TBD') {
    return 'TBD';
  }

  if (date) {
    return new Date(time ? `${date} ${time}` : date);
  }

  return undefined;
}

export const getGameTimestampInSeconds = (args: {
  readonly date?: string;
  readonly time?: string;
  readonly fullDate?: string;
}): number | undefined => {
  const {date, time, fullDate} = args;
  const d = getDateFromGame({date, time, fullDate});
  if (!d || d === 'TBD') return undefined;
  return d.getTime() / 1000;
};
