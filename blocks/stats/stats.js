const FALLBACK_DATA = [
  { Player: 'Conor Wilkens', Pos: 'CF', AB: 3, R: 1, H: 2, RBI: 1, BB: 0, SO: 1 },
  { Player: 'Sean Fox', Pos: 'P', AB: 2, R: 0, H: 0, RBI: 1, BB: 1, SO: 2 },
  { Player: 'Matthew Grosskurth', Pos: '3B', AB: 2, R: 2, H: 1, RBI: 1, BB: 1, SO: 0 },
  { Player: 'CJ Solomon', Pos: 'SS', AB: 2, R: 3, H: 2, RBI: 2, BB: 1, SO: 0 },
  { Player: 'Christian Cestare', Pos: 'C', AB: 3, R: 0, H: 0, RBI: 0, BB: 0, SO: 3 },
  { Player: 'Joshua Saponieri', Pos: 'LF', AB: 0, R: 1, H: 0, RBI: 0, BB: 2, SO: 0 },
  { Player: 'Landon McKillop', Pos: '2B', AB: 1, R: 0, H: 1, RBI: 1, BB: 1, SO: 0 },
  { Player: 'Connor Daly', Pos: '1B', AB: 1, R: 0, H: 0, RBI: 1, BB: 1, SO: 1 },
  { Player: 'Nicky Capozzoli', Pos: 'RF', AB: 2, R: 1, H: 1, RBI: 0, BB: 0, SO: 1 },
  { Player: 'Brogan Schaefer', Pos: '', AB: 0, R: 2, H: 0, RBI: 0, BB: 1, SO: 0 },
  { Player: 'Stevie Kull', Pos: '', AB: 1, R: 1, H: 0, RBI: 1, BB: 1, SO: 0 },
  { Player: 'Connor Philbin', Pos: '', AB: 1, R: 1, H: 0, RBI: 1, BB: 1, SO: 1 },
  { Player: 'Salvatore Giordano', Pos: '', AB: 1, R: 0, H: 0, RBI: 1, BB: 1, SO: 1 },
];

const STAT_COLS = ['AB', 'R', 'H', 'RBI', 'BB', 'SO', 'AVG'];

function calcAvg(h, ab) {
  if (ab === 0) return '.---';
  return (h / ab).toFixed(3).replace(/^0/, '');
}

async function fetchStats() {
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
      RBI: Number(r.RBI || r.rbi || 0),
      BB: Number(r.BB || r.bb || 0),
      SO: Number(r.SO || r.so || 0),
    }));
  } catch {
    return FALLBACK_DATA;
  }
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
      <td class="${p.RBI > 0 ? 'highlight' : ''}">${p.RBI}</td>
      <td>${p.BB}</td>
      <td>${p.SO}</td>
      <td class="avg-col">${avg}</td>
    `;
    tbody.append(tr);
  });

  const totals = statsData.reduce((acc, p) => {
    acc.AB += p.AB; acc.R += p.R; acc.H += p.H;
    acc.RBI += p.RBI; acc.BB += p.BB; acc.SO += p.SO;
    return acc;
  }, { AB: 0, R: 0, H: 0, RBI: 0, BB: 0, SO: 0 });
  const tr = document.createElement('tr');
  tr.className = 'totals-row';
  tr.innerHTML = `
    <td class="player-col">Team Totals</td>
    <td>${totals.AB}</td><td>${totals.R}</td><td>${totals.H}</td>
    <td>${totals.RBI}</td><td>${totals.BB}</td><td>${totals.SO}</td>
    <td class="avg-col">${calcAvg(totals.H, totals.AB)}</td>
  `;
  tbody.append(tr);
}

export default async function decorate(block) {
  block.textContent = '';

  const note = document.createElement('p');
  note.className = 'stats-note';
  note.textContent = 'Tap a column to sort. Stats from GameChanger.';

  // Sort controls for mobile
  const sortBar = document.createElement('div');
  sortBar.className = 'stats-sort-bar';
  sortBar.innerHTML = `
    <label>Sort by</label>
    <select class="stats-sort-select">
      <option value="7" selected>AVG</option>
      <option value="1">AB</option>
      <option value="2">R</option>
      <option value="3">H</option>
      <option value="4">RBI</option>
      <option value="5">BB</option>
      <option value="6">SO</option>
    </select>
  `;

  // Mobile card view
  const cardView = document.createElement('div');
  cardView.className = 'stats-cards';

  // Desktop table view
  const wrap = document.createElement('div');
  wrap.className = 'stats-table-wrap';
  const table = document.createElement('table');
  table.className = 'stats-table';

  const cols = ['Player', ...STAT_COLS];
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
  let sortCol = 7;
  let sortAsc = false;

  function getSorted() {
    return [...statsData].sort((a, b) => {
      const keys = [null, 'AB', 'R', 'H', 'RBI', 'BB', 'SO'];
      let va;
      let vb;
      if (sortCol === 7) {
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
