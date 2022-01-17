'use strict';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fixtureDir = path.join(__dirname, 'fixtures');

export function join(...args) {
  return [].concat(...args, '').join('\n');
}
