module.exports.withCommas = (value) => {
  if (typeof value !== 'number') {
    throw new Error(`Expected a number, but got ${value} of type "${typeof value}".`);
  }

  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

module.exports.getGameTimestampInSeconds = ({date, time, fullDate}) => {
  let d;
  if (fullDate) {
    d = new Date(fullDate);
  } else if (time) {
    d = new Date(date + ' ' + time);
  } else {
    d = new Date(date);
  }

  return d.getTime() / 1000;
};
