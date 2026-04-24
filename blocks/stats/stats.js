const FALLBACK_DATA = [
  { Player: 'Conor Wilkens', Pos: 'CF', AB: 3, R: 1, H: 2, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 0, SO: 1 },
  { Player: 'Sean Fox', Pos: 'P', AB: 2, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 2 },
  { Player: 'Matthew Grosskurth', Pos: '3B', AB: 2, R: 2, H: 1, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 0 },
  { Player: 'CJ Solomon', Pos: 'SS', AB: 2, R: 3, H: 2, '2B': 0, '3B': 0, HR: 1, RBI: 2, BB: 1, SO: 0 },
  { Player: 'Christian Cestare', Pos: 'C', AB: 3, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 0, SO: 3 },
  { Player: 'Joshua Saponieri', Pos: 'LF', AB: 0, R: 1, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 2, SO: 0 },
  { Player: 'Landon McKillop', Pos: '2B', AB: 1, R: 0, H: 1, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 0 },
  { Player: 'Connor Daly', Pos: '1B', AB: 1, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 1 },
  { Player: 'Nicky Capozzoli', Pos: 'RF', AB: 2, R: 1, H: 1, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 0, SO: 1 },
  { Player: 'Brogan Schaefer', Pos: '', AB: 0, R: 2, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 1, SO: 0 },
  { Player: 'Stevie Kull', Pos: '', AB: 1, R: 1, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 0 },
  { Player: 'Connor Philbin', Pos: '', AB: 1, R: 1, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 1 },
  { Player: 'Salvatore Giordano', Pos: '', AB: 1, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 1, BB: 1, SO: 1 },
];

const STAT_COLS = ['AB', 'R', 'H', '2B', '3B', 'HR', 'RBI', 'BB', 'SO', 'AVG'];

function calcAvg(h, ab) {
  if (ab === 0) return '.---';
  return (h / ab).toFixed(3).replace(/^0/, '');
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') { inQuotes = true; }
    else if (ch === ',') { row.push(field.trim()); field = ''; }
    else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
      row.push(field.trim()); field = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      if (ch === '\r') i += 1;
    } else { field += ch; }
  }
  if (field || row.length) { row.push(field.trim()); if (row.some((c) => c !== '')) rows.push(row); }
  return rows;
}

function parseGameChangerCSV(text) {
  const rows = parseCSV(text);
  if (rows.length < 3) return null;

  const catRow = rows[0];
  const headers = rows[1];

  let battingEnd = headers.length;
  for (let i = 0; i < catRow.length; i += 1) {
    if (catRow[i] === 'Pitching') { battingEnd = i; break; }
  }

  const colIdx = {};
  for (let i = 0; i < battingEnd; i += 1) {
    if (headers[i] && !colIdx[headers[i]]) colIdx[headers[i]] = i;
  }

  const get = (row, name) => (colIdx[name] !== undefined ? row[colIdx[name]] || '' : '');
  const getNum = (row, name) => {
    const v = get(row, name);
    if (v === '' || v === '-' || v === 'N/A') return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const players = [];
  for (let i = 2; i < rows.length; i += 1) {
    const row = rows[i];
    const num = get(row, 'Number');
    const first = get(row, 'First');
    const last = get(row, 'Last');
    if (num === 'Totals' || num === 'Glossary' || (!first && !last)) continue;
    players.push({
      Player: `${first} ${last}`.trim(),
      Pos: '',
      AB: getNum(row, 'AB'),
      R: getNum(row, 'R'),
      H: getNum(row, 'H'),
      '2B': getNum(row, '2B'),
      '3B': getNum(row, '3B'),
      HR: getNum(row, 'HR'),
      RBI: getNum(row, 'RBI'),
      BB: getNum(row, 'BB'),
      SO: getNum(row, 'SO'),
    });
  }
  return players.length > 0 ? players : null;
}

function parseSimpleCSV(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return null;
  const headers = rows[0];
  const find = (...names) => headers.findIndex((h) => names.includes(h));
  const playerIdx = find('Player', 'player', 'Name', 'name');
  const abIdx = find('AB', 'ab');
  if (playerIdx < 0 || abIdx < 0) return null;

  const posIdx = find('Pos', 'pos', 'Position');
  const rIdx = find('R', 'r');
  const hIdx = find('H', 'h');
  const dbIdx = find('2B');
  const tbIdx = find('3B');
  const hrIdx = find('HR', 'hr');
  const rbiIdx = find('RBI', 'rbi');
  const bbIdx = find('BB', 'bb');
  const soIdx = find('SO', 'so');
  const col = (row, idx) => (idx >= 0 ? Number(row[idx]) || 0 : 0);

  return rows.slice(1)
    .filter((r) => r[playerIdx] && r[playerIdx] !== 'Totals')
    .map((r) => ({
      Player: r[playerIdx] || '',
      Pos: posIdx >= 0 ? r[posIdx] || '' : '',
      AB: col(r, abIdx), R: col(r, rIdx), H: col(r, hIdx),
      '2B': col(r, dbIdx), '3B': col(r, tbIdx), HR: col(r, hrIdx),
      RBI: col(r, rbiIdx), BB: col(r, bbIdx), SO: col(r, soIdx),
    }));
}

async function fetchStats() {
  try {
    const resp = await fetch('/stats.csv');
    if (resp.ok) {
      const text = await resp.text();
      if (text && !text.startsWith('<?xml') && !text.startsWith('<!DOCTYPE')) {
        const gc = parseGameChangerCSV(text);
        if (gc) return gc;
        const simple = parseSimpleCSV(text);
        if (simple) return simple;
      }
    }
  } catch { /* fall through */ }

  try {
    const resp = await fetch('/stats.json');
    if (!resp.ok) throw new Error(resp.status);
    const json = await resp.json();
    const rows = json.data || json;
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('empty');
    return rows.map((r) => ({
      Player: r.Player || r.player || r.Name || r.name || '',
      Pos: r.Pos || r.pos || r.Position || r.position || '',
      AB: Number(r.AB || r.ab || 0),
      R: Number(r.R || r.r || 0),
      H: Number(r.H || r.h || 0),
      '2B': Number(r['2B'] || 0),
      '3B': Number(r['3B'] || 0),
      HR: Number(r.HR || r.hr || 0),
      RBI: Number(r.RBI || r.rbi || 0),
      BB: Number(r.BB || r.bb || 0),
      SO: Number(r.SO || r.so || 0),
    }));
  } catch { /* fall through */ }

  return FALLBACK_DATA;
}

function buildCards(container, sorted) {
  container.innerHTML = '';
  sorted.forEach((p) => {
    const avg = calcAvg(p.H, p.AB);
    const posLabel = p.Pos ? `<span class="stats-card-pos">${p.Pos}</span>` : '';
    const card = document.createElement('div');
    card.className = 'stats-card';
    card.innerHTML = `
      <div class="stats-card-header">
        <span class="stats-card-name">${p.Player}</span>
        ${posLabel}
        <span class="stats-card-avg">${avg}</span>
      </div>
      <div class="stats-card-grid">
        <div class="stats-card-stat"><span class="stats-card-val">${p.AB}</span><span class="stats-card-label">AB</span></div>
        <div class="stats-card-stat"><span class="stats-card-val">${p.R}</span><span class="stats-card-label">R</span></div>
        <div class="stats-card-stat"><span class="stats-card-val ${p.H > 0 ? 'highlight' : ''}">${p.H}</span><span class="stats-card-label">H</span></div>
        <div class="stats-card-stat"><span class="stats-card-val ${p['2B'] > 0 ? 'highlight' : ''}">${p['2B']}</span><span class="stats-card-label">2B</span></div>
        <div class="stats-card-stat"><span class="stats-card-val ${p['3B'] > 0 ? 'highlight' : ''}">${p['3B']}</span><span class="stats-card-label">3B</span></div>
        <div class="stats-card-stat"><span class="stats-card-val ${p.HR > 0 ? 'highlight' : ''}">${p.HR}</span><span class="stats-card-label">HR</span></div>
        <div class="stats-card-stat"><span class="stats-card-val ${p.RBI > 0 ? 'highlight' : ''}">${p.RBI}</span><span class="stats-card-label">RBI</span></div>
        <div class="stats-card-stat"><span class="stats-card-val">${p.BB}</span><span class="stats-card-label">BB</span></div>
        <div class="stats-card-stat"><span class="stats-card-val">${p.SO}</span><span class="stats-card-label">SO</span></div>
      </div>
    `;
    container.append(card);
  });
}

function buildTable(thead, tbody, sorted, statsData) {
  tbody.innerHTML = '';
  sorted.forEach((p) => {
    const avg = calcAvg(p.H, p.AB);
    const posLabel = p.Pos ? ` <span class="pos-label">(${p.Pos})</span>` : '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="player-col">${p.Player}${posLabel}</td>
      <td>${p.AB}</td>
      <td>${p.R}</td>
      <td class="${p.H > 0 ? 'highlight' : ''}">${p.H}</td>
      <td class="${p['2B'] > 0 ? 'highlight' : ''}">${p['2B']}</td>
      <td class="${p['3B'] > 0 ? 'highlight' : ''}">${p['3B']}</td>
      <td class="${p.HR > 0 ? 'highlight' : ''}">${p.HR}</td>
      <td class="${p.RBI > 0 ? 'highlight' : ''}">${p.RBI}</td>
      <td>${p.BB}</td>
      <td>${p.SO}</td>
      <td class="avg-col">${avg}</td>
    `;
    tbody.append(tr);
  });

  const totals = statsData.reduce((acc, p) => {
    acc.AB += p.AB; acc.R += p.R; acc.H += p.H;
    acc['2B'] += p['2B']; acc['3B'] += p['3B']; acc.HR += p.HR;
    acc.RBI += p.RBI; acc.BB += p.BB; acc.SO += p.SO;
    return acc;
  }, { AB: 0, R: 0, H: 0, '2B': 0, '3B': 0, HR: 0, RBI: 0, BB: 0, SO: 0 });
  const tr = document.createElement('tr');
  tr.className = 'totals-row';
  tr.innerHTML = `
    <td class="player-col">${typeof tFn === 'function' ? tFn('teamTotals') : 'Team Totals'}</td>
    <td>${totals.AB}</td><td>${totals.R}</td><td>${totals.H}</td>
    <td>${totals['2B']}</td><td>${totals['3B']}</td><td>${totals.HR}</td>
    <td>${totals.RBI}</td><td>${totals.BB}</td><td>${totals.SO}</td>
    <td class="avg-col">${calcAvg(totals.H, totals.AB)}</td>
  `;
  tbody.append(tr);
}

export default async function decorate(block) {
  let tFn;
  try { const i18n = await import('../../scripts/i18n.js'); tFn = i18n.t; } catch { tFn = (k) => k; }
  block.textContent = '';

  const note = document.createElement('p');
  note.className = 'stats-note';
  note.textContent = tFn('statsTip');

  const sortBar = document.createElement('div');
  sortBar.className = 'stats-sort-bar';
  sortBar.innerHTML = `
    <label>${tFn('sortBy')}</label>
    <select class="stats-sort-select">
      <option value="10" selected>AVG</option>
      <option value="1">AB</option>
      <option value="2">R</option>
      <option value="3">H</option>
      <option value="4">2B</option>
      <option value="5">3B</option>
      <option value="6">HR</option>
      <option value="7">RBI</option>
      <option value="8">BB</option>
      <option value="9">SO</option>
    </select>
  `;

  const cardView = document.createElement('div');
  cardView.className = 'stats-cards';

  const wrap = document.createElement('div');
  wrap.className = 'stats-table-wrap';
  const table = document.createElement('table');
  table.className = 'stats-table';

  const cols = [tFn('player'), ...STAT_COLS];
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  cols.forEach((col, i) => {
    const th = document.createElement('th');
    th.textContent = col;
    if (i > 0) {
      th.className = 'sortable';
      th.addEventListener('click', () => sortBy(i));
    }
    headRow.append(th);
  });
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement('tbody');
  table.append(tbody);
  wrap.append(table);

  block.append(note, sortBar, cardView, wrap);

  const statsData = await fetchStats();
  let sortCol = 10; // AVG
  let sortAsc = false;

  function getSorted() {
    const keys = [null, 'AB', 'R', 'H', '2B', '3B', 'HR', 'RBI', 'BB', 'SO'];
    return [...statsData].sort((a, b) => {
      let va;
      let vb;
      if (sortCol === 10) {
        va = a.AB === 0 ? -1 : a.H / a.AB;
        vb = b.AB === 0 ? -1 : b.H / b.AB;
      } else {
        va = a[keys[sortCol]];
        vb = b[keys[sortCol]];
      }
      return sortAsc ? va - vb : vb - va;
    });
  }

  function render() {
    const sorted = getSorted();
    buildCards(cardView, sorted);
    buildTable(thead, tbody, sorted, statsData);
  }

  function sortBy(col) {
    if (sortCol === col) sortAsc = !sortAsc;
    else { sortCol = col; sortAsc = false; }
    sortBar.querySelector('select').value = String(col);
    render();
  }

  sortBar.querySelector('select').addEventListener('change', (e) => {
    sortCol = Number(e.target.value);
    sortAsc = false;
    render();
  });

  render();
}
