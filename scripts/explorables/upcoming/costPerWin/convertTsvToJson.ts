import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TSV_INPUT_FILE = path.resolve(__dirname, './data/coachSalaries2018.tsv');
const JSON_OUTPUT_FILE = path.resolve(__dirname, './data/coachSalaries2018.json');

type Salary = number | 'Unknown';

interface CoachSalaryRow {
  teamName?: string;
  headCoach?: string;
  salary?: Salary;
}

const lines = fs.readFileSync(TSV_INPUT_FILE, 'utf-8').split('\n');

const result: CoachSalaryRow[] = [];

const headers = lines[0]?.split('\t') ?? [];

lines.forEach((line, i) => {
  if (i > 0 && line.length > 0) {
    const obj: CoachSalaryRow = {};
    const currentLineTokens = line.split('\t');

    headers.forEach((header, j) => {
      const val = currentLineTokens[j];

      if (['teamName', 'headCoach'].includes(header)) {
        if (val) {
          obj[header as 'teamName' | 'headCoach'] = val;
        }
      } else if (header === 'totalPay') {
        if (!val || val === '--') {
          obj.salary = 'Unknown';
        } else {
          obj.salary = Number(val.slice(1).replace(/,/g, ''));
        }
      }
    });

    if (Object.keys(obj).length === 0) return;

    result.push(obj);
  }
});

fs.writeFileSync(JSON_OUTPUT_FILE, JSON.stringify(result, null, 2));
