import { AZKAR } from '../frontend/src/data/azkarData.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const output = AZKAR.map((a) => ({
  id: a.id,
  text: a.arabic,
  text_en: a.english,
  text_am: a.amharic,
  category: a.category,
  count: a.count,
  ...(a.reference ? { reference: a.reference } : {}),
  ...(a.reward ? { reward: a.reward } : {}),
}));

const outPath = path.resolve(__dirname, '../backend/src/data/azkar.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Synced ${output.length} azkar to ${outPath}`);
