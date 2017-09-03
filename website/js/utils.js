const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function getShortFormattedDate(date) {
  const d = new Date(date);
  const dayOfMonth = d.getUTCDate();
  const month = months[d.getUTCMonth()];

  return `${month} ${dayOfMonth}`;
}
