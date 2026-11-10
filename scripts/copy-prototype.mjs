// Copies the original static HTML prototype into dist/prototype so it stays viewable at /prototype/
import { cpSync, existsSync } from 'node:fs';
if (existsSync('prototype')) cpSync('prototype', 'dist/prototype', { recursive: true });
