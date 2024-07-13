import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request-promise';

export class Scraper {
  static async get(url: string): Promise<cheerio.Root> {
    return request({
      uri: url,
      transform: (body) => cheerio.load(body),
    }).catch((error) => {
      if (_.includes(error.message, 'ENOTFOUND')) {
        throw new Error(`Failed to scrape ${url}: ENOTFOUND.`);
      }

      throw error;
    });
  }
}
