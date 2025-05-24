export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const isMidnight = (date: Date): boolean => {
  return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
};

export function getDateFromGame(date: string | 'TBD'): Date | 'TBD' {
  if (date === 'TBD') {
    return 'TBD';
  }

  if (!isValidDate(date)) {
    throw new Error(`Game has invalid date: ${date}`);
  }

  return new Date(date);
}
