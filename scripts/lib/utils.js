const withCommas = (value) => {
  if (typeof value !== 'number') {
    throw new Error(`Expected a number, but got ${value} of type "${typeof value}".`);
  }

  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const getGameDate = ({date, time, fullDate}) => {
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

const getGameTimestampInSeconds = ({date, time, fullDate}) => {
  const d = getGameDate({date, time, fullDate});
  return d.getTime() / 1000;
};

const isNumber = (val) => {
  return typeof val === 'number' && !isNaN(val);
};

const isString = (val) => {
  return typeof val === 'string';
};

const isNonEmptyString = (val) => {
  return typeof val === 'string' && val !== '';
};

const getPossessionInSeconds = (possession) => {
  const [minutes, seconds] = possession.split(':');
  return Number(minutes) * 60 + Number(seconds);
};

module.exports = {
  isString,
  isNumber,
  withCommas,
  getGameDate,
  isNonEmptyString,
  getPossessionInSeconds,
  getGameTimestampInSeconds,
};
