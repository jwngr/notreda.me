import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request-promise';

module.exports.get = async (url) => {
  return request({
    uri: url,
    transform: (body) => cheerio.load(body),
  }).catch((error) => {
    if (_.includes(error.message, 'ENOTFOUND')) {
      throw new Error(`Failed to scrape ${url}: ENOTFOUND.`);
    }

    throw error;
  });
};
