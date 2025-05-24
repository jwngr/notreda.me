import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GameData {
  fullDate?: string | 'TBD';
  date?: string | 'TBD';
  [key: string]: unknown;
}

function renameFullDateToDate(game: GameData): GameData {
  const newGame: GameData = {...game};

  // If has fullDate, rename it to date
  if (game.fullDate !== undefined) {
    newGame.date = game.fullDate;
    delete newGame.fullDate;
  }

  return newGame;
}

function updateScheduleFile(filePath: string): void {
  // eslint-disable-next-line no-console
  console.log(`Updating ${filePath}...`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const games: GameData[] = JSON.parse(fileContent);

    const updatedGames = games.map(renameFullDateToDate);

    // Write back to file with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(updatedGames, null, 2) + '\n');

    // eslint-disable-next-line no-console
    console.log(`✅ Successfully updated ${filePath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Error updating ${filePath}:`, error);
  }
}

function updateAllSchedules(): void {
  const schedulesDir = path.join(__dirname, '../website/src/resources/schedules');

  try {
    const files = fs.readdirSync(schedulesDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    // eslint-disable-next-line no-console
    console.log(`Found ${jsonFiles.length} schedule files to update`);

    jsonFiles.forEach((file) => {
      const filePath = path.join(schedulesDir, file);
      updateScheduleFile(filePath);
    });

    // eslint-disable-next-line no-console
    console.log('🎉 Update completed!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error during update:', error);
    process.exit(1);
  }
}

// Run the update
if (import.meta.url === `file://${process.argv[1]}`) {
  updateAllSchedules();
}

export {updateAllSchedules, renameFullDateToDate};
