const fs = require('fs');
const path = require('path');

const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');
const SITEMAP_FILENAME = path.resolve(__dirname, '../../public/sitemap.xml');

const scheduleFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

const paths = ['/', '/explorables/s1e1-down-to-the-wire/'];

scheduleFilenames.forEach((filename) => {
  const year = filename.split('.json')[0];
  const games = require(`${SCHEDULE_DATA_DIRECTORY}/${filename}`);

  paths.push(`/${year}/`);

  games.forEach((game, i) => {
    paths.push(`/${year}/${i + 1}/`);
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

console.log(`[INFO] Sitemap successfully written to ${SITEMAP_FILENAME}!`);
