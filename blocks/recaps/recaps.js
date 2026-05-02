import { t, getRecapBody } from '../../scripts/i18n.js';

function parseHeading(text) {
  // Match: "Game N [separator] W/L/T Score vs Opponent [separator] Date"
  // Uses a single regex to avoid splitting on hyphens inside team names
  // Date anchored by 3-letter weekday (Mon|Tue|Wed|Thu|Fri|Sat|Sun)
  const match = text.match(
    /^Game\s+(\d+)\s*[-—–]\s*(W|L|T)\s+(\d+-\d+)\s+vs\s+(.+?)\s*[-—–]\s*((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[,\s].+)$/i,
  );
  if (!match) return null;

  return {
    game: Number(match[1]),
    resultClass: match[2].toUpperCase() === 'W' ? 'win' : match[2].toUpperCase() === 'L' ? 'loss' : 'tie',
    result: `${match[2].toUpperCase()} ${match[3]}`,
    score: match[3],
    wl: match[2].toUpperCase(),
    opponent: match[4].trim(),
    date: match[5].trim(),
  };
}

function buildTitle(info) {
  if (info.wl === 'W') return `${t('winPrefix')} ${info.opponent} ${info.score}`;
  if (info.wl === 'L') return `${t('lossPrefix')} ${info.opponent}`;
  return `${t('tiePrefix')} ${info.opponent} ${info.score}`;
}

async function fetchRecaps() {
  try {
    const resp = await fetch('/recaps.plain.html');
    if (!resp.ok) throw new Error(resp.status);
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('div');
    const recaps = [];
    sections.forEach((section) => {
      const h2 = section.querySelector('h2');
      if (!h2) return;
      // Get text content (strips <strong> and other inline tags)
      const info = parseHeading(h2.textContent.trim());
      if (!info) return;
      const paragraphs = [...section.querySelectorAll('p')];
      info.body = paragraphs.map((p) => `<p>${p.innerHTML}</p>`).join('');
      info.title = buildTitle(info);
      recaps.push(info);
    });
    return recaps.length > 0 ? recaps : null;
  } catch { return null; }
}

function renderRecaps(block, recaps, activeGame) {
  block.textContent = '';

  if (!recaps || recaps.length === 0) {
    block.innerHTML = `<p class="recaps-empty">${t('noRecaps')}</p>`;
    return;
  }

  const filterBar = document.createElement('div');
  filterBar.className = 'recaps-filter';
  const allBtn = document.createElement('button');
  allBtn.className = `recaps-filter-btn${activeGame === 'all' ? ' active' : ''}`;
  allBtn.textContent = t('allGames');
  allBtn.dataset.game = 'all';
  filterBar.append(allBtn);

  recaps.forEach((r) => {
    const btn = document.createElement('button');
    btn.className = `recaps-filter-btn${String(r.game) === String(activeGame) ? ' active' : ''}`;
    btn.textContent = r.date;
    btn.dataset.game = r.game;
    filterBar.append(btn);
  });

  const cardList = document.createElement('div');
  cardList.className = 'recaps-list';

  recaps.forEach((r) => {
    const title = buildTitle(r);
    const translatedBody = getRecapBody(r.game);
    const body = translatedBody || r.body;

    const card = document.createElement('article');
    card.className = 'recap-card';
    card.dataset.game = r.game;
    card.style.display = (activeGame === 'all' || String(r.game) === String(activeGame)) ? '' : 'none';
    card.innerHTML = `
      <div class="recap-header">
        <h3 class="recap-title">${title}</h3>
        <p class="recap-subtitle">${r.date} ${t('vs')}. ${r.opponent}</p>
        <span class="recap-badge ${r.resultClass}">${r.result}</span>
      </div>
      <div class="recap-body">${body}</div>
    `;
    cardList.append(card);
  });

  block.append(filterBar, cardList);

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.recaps-filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.recaps-filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const game = btn.dataset.game;
    cardList.querySelectorAll('.recap-card').forEach((card) => {
      card.style.display = (game === 'all' || card.dataset.game === game) ? '' : 'none';
    });
    block.recapsActiveGame = game;
  });
}

export default async function decorate(block) {
  block.textContent = '';
  block.recapsActiveGame = 'all';

  const recaps = await fetchRecaps();
  renderRecaps(block, recaps, 'all');

  document.addEventListener('lang-change', () => {
    renderRecaps(block, recaps, block.recapsActiveGame || 'all');
  });
}
