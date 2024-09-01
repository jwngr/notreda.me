import * as cheerio from 'cheerio';

export class Scraper {
  static async get(url: string): Promise<cheerio.Root> {
    try {
      const response = await fetch(url);
      const body = await response.text();
      return cheerio.load(body);
    } catch (error) {
      if ((error as unknown as Error).message.includes('ENOTFOUND')) {
        throw new Error(`Failed to scrape ${url}: ENOTFOUND.`);
      }

      throw error;
    }
  }
}
