const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

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


/**
 * Returns a date string in the format 'Month DD'.
 *
 * @param {string} date A date string in the format 'MM/DD/YY'.
 * @return {string} A date string in the format 'Month DD'.
 */
export function getShortFormattedDate(date) {
  const d = new Date(date);
  const dayOfMonth = d.getUTCDate();
  const month = months[d.getUTCMonth()];

  return `${month} ${dayOfMonth}`;
}


/**
 * Returns a date string in the format 'Weekday, Month DD, YYYY'.
 *
 * @param {string} date A date string in the format 'MM/DD/YY'.
 * @return {string} A date string in the format 'Weekday, Month DD, YYYY'.
 */
export function getLongFormattedDate(date) {
  const d = new Date(date);
  const weekday = weekdays[d.getUTCDay()];
  const dayOfMonth = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${weekday}, ${month} ${dayOfMonth}, ${year}`;
}
