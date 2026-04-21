#!/usr/bin/env node
/**
 * Converts a GameChanger CSV stats export into a clean stats.xlsx
 * for upload to DA (which serves it as /stats.json).
 *
 * Usage: node tools/convert-stats.js "path/to/GameChanger Export.csv"
 * Output: stats.xlsx (in current directory)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node tools/convert-stats.js <gamechanger-export.csv>');
  process.exit(1);
}

// Parse CSV (handles quoted fields with commas)
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field.trim());
      field = '';
    } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
      row.push(field.trim());
      field = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      if (ch === '\r') i += 1;
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    if (row.some((c) => c !== '')) rows.push(row);
  }
  return rows;
}

// Read and parse CSV
const raw = readFileSync(resolve(csvPath), 'utf-8');
const rows = parseCSV(raw);

// Row 0 = category headers (Batting / Pitching / Fielding)
// Row 1 = column names
// Row 2+ = player data
// Last data row = "Totals"
// After that = empty + Glossary

const headers = rows[1];
if (!headers) {
  console.error('Could not find column headers in row 2');
  process.exit(1);
}

// Find batting column indices (before "Pitching" category in row 0)
const catRow = rows[0];
let battingEnd = headers.length;
for (let i = 0; i < catRow.length; i += 1) {
  if (catRow[i] === 'Pitching') {
    battingEnd = i;
    break;
  }
}

// Build column index map for batting section only
const colIdx = {};
for (let i = 0; i < battingEnd; i += 1) {
  const name = headers[i];
  if (name && !colIdx[name]) colIdx[name] = i;
}

function getVal(row, name) {
  const idx = colIdx[name];
  if (idx === undefined) return '';
  return row[idx] || '';
}

function getNum(row, name) {
  const v = getVal(row, name);
  if (v === '' || v === '-' || v === '.000' || v === 'N/A') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

// Extract player data (skip header rows, totals, glossary, empty)
const players = [];
for (let i = 2; i < rows.length; i += 1) {
  const row = rows[i];
  const first = getVal(row, 'First');
  const last = getVal(row, 'Last');
  const number = getVal(row, 'Number');

  // Skip totals row, glossary, empty rows
  if (number === 'Totals' || number === 'Glossary') continue;
  if (!first && !last) continue;

  players.push({
    Player: `${first} ${last}`.trim(),
    Pos: '', // GC export doesn't have a single position column in this format
    GP: getNum(row, 'GP'),
    AB: getNum(row, 'AB'),
    R: getNum(row, 'R'),
    H: getNum(row, 'H'),
    '1B': getNum(row, '1B'),
    '2B': getNum(row, '2B'),
    '3B': getNum(row, '3B'),
    HR: getNum(row, 'HR'),
    RBI: getNum(row, 'RBI'),
    BB: getNum(row, 'BB'),
    SO: getNum(row, 'SO'),
    HBP: getNum(row, 'HBP'),
    SB: getNum(row, 'SB'),
    CS: getNum(row, 'CS'),
  });
}

if (players.length === 0) {
  console.error('No player data found in CSV');
  process.exit(1);
}

// Write as simple CSV (tab-separated for easy DA ingestion, or real xlsx)
// Since xlsx module may not be available, output as CSV that can be opened in Excel
const outCols = ['Player', 'Pos', 'GP', 'AB', 'R', 'H', '1B', '2B', '3B', 'HR', 'RBI', 'BB', 'SO', 'HBP', 'SB', 'CS'];
const csvLines = [outCols.join(',')];
players.forEach((p) => {
  csvLines.push(outCols.map((c) => {
    const v = p[c];
    if (typeof v === 'string' && v.includes(',')) return `"${v}"`;
    return v;
  }).join(','));
});

writeFileSync('stats.csv', csvLines.join('\n'), 'utf-8');
console.log(`Converted ${players.length} players → stats.csv`);
console.log('');
console.log('Players:');
players.forEach((p) => {
  const avg = p.AB > 0 ? (p.H / p.AB).toFixed(3) : '.---';
  console.log(`  ${p.Player.padEnd(22)} AB:${String(p.AB).padStart(2)} R:${String(p.R).padStart(2)} H:${String(p.H).padStart(2)} RBI:${String(p.RBI).padStart(2)} BB:${String(p.BB).padStart(2)} SO:${String(p.SO).padStart(2)} AVG:${avg}`);
});
console.log('');
console.log('Next steps:');
console.log('  1. Open stats.csv in Excel/Google Sheets');
console.log('  2. Add positions in the Pos column if desired');
console.log('  3. Save as stats.xlsx');
console.log('  4. Upload stats.xlsx to DA and click Preview');
