export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
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
