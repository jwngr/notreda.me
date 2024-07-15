import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {getForSeason} from '../../website/src/resources/schedules';
import {ALL_SEASONS} from '../lib/constants';
import {Logger} from '../lib/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger({isSentryEnabled: false});

const SITEMAP_FILENAME = path.resolve(__dirname, '../../website/public/sitemap.xml');

function main() {
  const paths = [
    '/',
    '/explorables/',
    '/explorables/s1e1-down-to-the-wire/',
    '/explorables/s1e2-chasing-perfection',
  ];

  for (const season of ALL_SEASONS) {
    const seasonScheduleData = getForSeason(season);
    paths.push(`/${season}/`);

    seasonScheduleData.forEach((_, i) => {
      paths.push(`/${season}/${i + 1}/`);
    });
  }

  const urls = paths.map((path) => {
    return `  <url><loc>https://notreda.me${path}</loc></url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('\n')}
  </urlset>
  `;

  fs.writeFileSync(SITEMAP_FILENAME, sitemap);

  logger.info(`Sitemap successfully written to ${SITEMAP_FILENAME}!`);
}

main();
