export const withCommas = (value) => {
  if (typeof value !== 'number') {
    throw new Error(`Expected a number, but got ${value} of type "${typeof value}".`);
  }

  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const makeId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getGameDate = ({date, time, fullDate}) => {
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

export const getGameTimestampInSeconds = ({date, time, fullDate}) => {
  const d = getGameDate({date, time, fullDate});
  return d.getTime() / 1000;
};

export const isNumber = (val) => {
  return typeof val === 'number' && !isNaN(val);
};

export const isString = (val) => {
  return typeof val === 'string';
};

export const isNonEmptyString = (val) => {
  return typeof val === 'string' && val !== '';
};

export const getPossessionInSeconds = (possession) => {
  const [minutes, seconds] = possession.split(':');
  return Number(minutes) * 60 + Number(seconds);
};
