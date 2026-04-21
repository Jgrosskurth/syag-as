const STATS_DATA = [
  { name: "Conor Wilkens", pos: "CF", ab: 3, r: 1, h: 2, rbi: 1, bb: 0, so: 1 },
  { name: "Sean Fox", pos: "P", ab: 2, r: 0, h: 0, rbi: 1, bb: 1, so: 2 },
  { name: "Matthew Grosskurth", pos: "3B", ab: 2, r: 2, h: 1, rbi: 1, bb: 1, so: 0 },
  { name: "CJ Solomon", pos: "SS", ab: 2, r: 3, h: 2, rbi: 2, bb: 1, so: 0 },
  { name: "Christian Cestare", pos: "C", ab: 3, r: 0, h: 0, rbi: 0, bb: 0, so: 3 },
  { name: "Joshua Saponieri", pos: "LF", ab: 0, r: 1, h: 0, rbi: 0, bb: 2, so: 0 },
  { name: "Landon McKillop", pos: "2B", ab: 1, r: 0, h: 1, rbi: 1, bb: 1, so: 0 },
  { name: "Connor Daly", pos: "1B", ab: 1, r: 0, h: 0, rbi: 1, bb: 1, so: 1 },
  { name: "Nicky Capozzoli", pos: "RF", ab: 2, r: 1, h: 1, rbi: 0, bb: 0, so: 1 },
  { name: "Brogan Schaefer", pos: "", ab: 0, r: 2, h: 0, rbi: 0, bb: 1, so: 0 },
  { name: "Stevie Kull", pos: "", ab: 1, r: 1, h: 0, rbi: 1, bb: 1, so: 0 },
  { name: "Connor Philbin", pos: "", ab: 1, r: 1, h: 0, rbi: 1, bb: 1, so: 1 },
  { name: "Salvatore Giordano", pos: "", ab: 1, r: 0, h: 0, rbi: 1, bb: 1, so: 1 },
];

function calcAvg(h, ab) {
  if (ab === 0) return '.---';
  return (h / ab).toFixed(3).replace(/^0/, '');
}

export default function decorate(block) {
  block.textContent = '';

  const note = document.createElement('p');
  note.className = 'stats-note';
  note.textContent = 'Click any column header to sort. Stats from GameChanger.';

  const wrap = document.createElement('div');
  wrap.className = 'stats-table-wrap';

  const table = document.createElement('table');
  table.className = 'stats-table';

  const cols = ['Player', 'AB', 'R', 'H', 'RBI', 'BB', 'SO', 'AVG'];
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  cols.forEach((col, i) => {
    const th = document.createElement('th');
    th.textContent = col;
    if (i > 0) {
      th.dataset.col = i;
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
  block.append(note, wrap);

  let sortCol = 7;
  let sortAsc = false;

  function render() {
    const sorted = [...STATS_DATA].sort((a, b) => {
      const keys = [null, 'ab', 'r', 'h', 'rbi', 'bb', 'so'];
      let va;
      let vb;
      if (sortCol === 7) {
        va = a.ab === 0 ? -1 : a.h / a.ab;
        vb = b.ab === 0 ? -1 : b.h / b.ab;
      } else {
        va = a[keys[sortCol]];
        vb = b[keys[sortCol]];
      }
      return sortAsc ? va - vb : vb - va;
    });

    tbody.innerHTML = '';
    sorted.forEach((p) => {
      const avg = calcAvg(p.h, p.ab);
      const posLabel = p.pos ? ` <span class="pos-label">(${p.pos})</span>` : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="player-col">${p.name}${posLabel}</td>
        <td>${p.ab}</td>
        <td>${p.r}</td>
        <td class="${p.h > 0 ? 'highlight' : ''}">${p.h}</td>
        <td class="${p.rbi > 0 ? 'highlight' : ''}">${p.rbi}</td>
        <td>${p.bb}</td>
        <td>${p.so}</td>
        <td class="avg-col">${avg}</td>
      `;
      tbody.append(tr);
    });

    // Totals
    const totals = STATS_DATA.reduce((acc, p) => {
      acc.ab += p.ab; acc.r += p.r; acc.h += p.h;
      acc.rbi += p.rbi; acc.bb += p.bb; acc.so += p.so;
      return acc;
    }, { ab: 0, r: 0, h: 0, rbi: 0, bb: 0, so: 0 });
    const tr = document.createElement('tr');
    tr.className = 'totals-row';
    tr.innerHTML = `
      <td class="player-col">Team Totals</td>
      <td>${totals.ab}</td><td>${totals.r}</td><td>${totals.h}</td>
      <td>${totals.rbi}</td><td>${totals.bb}</td><td>${totals.so}</td>
      <td class="avg-col">${calcAvg(totals.h, totals.ab)}</td>
    `;
    tbody.append(tr);
  }

  function sortBy(col) {
    if (sortCol === col) sortAsc = !sortAsc;
    else { sortCol = col; sortAsc = false; }
    render();
  }

  render();
}
