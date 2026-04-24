import { t, getLang, getRecapBody } from '../../scripts/i18n.js';

function parseHeading(text) {
  const parts = text.split(/\s*[—–]\s*/);
  if (parts.length < 3) return null;
  const gameMatch = parts[0].match(/^Game\s+(\d+)$/i);
  if (!gameMatch) return null;
  const resultMatch = parts[1].match(/^(W|L|T)\s+([\d]+-[\d]+)\s+vs\s+(.+)$/i);
  if (!resultMatch) return null;
  return {
    game: Number(gameMatch[1]),
    resultClass: resultMatch[1].toUpperCase() === 'W' ? 'win' : resultMatch[1].toUpperCase() === 'L' ? 'loss' : 'tie',
    result: `${resultMatch[1].toUpperCase()} ${resultMatch[2]}`,
    score: resultMatch[2],
    wl: resultMatch[1].toUpperCase(),
    opponent: resultMatch[3].trim(),
    date: parts[2].trim(),
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
    btn.textContent = `${t('game')} ${r.game}`;
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
