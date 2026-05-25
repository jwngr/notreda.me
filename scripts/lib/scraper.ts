import * as cheerio from 'cheerio';

export class Scraper {
  static async get(url: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await fetch(url);
      const body = await response.text();
      return cheerio.load(body);
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOTFOUND')) {
        throw new Error(`Failed to scrape ${url}: ENOTFOUND.`, {cause: error});
      }

      throw error;
    }
  }
}
