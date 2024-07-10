const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const logger = require('../lib/logger');
const ndSchedules = require('../../website/src/resources/schedules');
const {ALL_SEASONS} = require('../lib/constants');

const SITEMAP_FILENAME = path.resolve(__dirname, '../../website/public/sitemap.xml');

const paths = [
  '/',
  '/explorables/',
  '/explorables/s1e1-down-to-the-wire/',
  '/explorables/s1e2-chasing-perfection',
];


ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);
  paths.push(`/${season}/`);

  seasonScheduleData.forEach((gameData, i) => {
    paths.push(`/${season}/${i + 1}/`);
  });
});

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
