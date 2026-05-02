import { t, getRecapBody } from '../../scripts/i18n.js';

function parseHeading(text) {
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
      const info = parseHeading(h2.textContent.trim());
      if (!info) return;
      const paragraphs = [...section.querySelectorAll('p')];
      info.body = paragraphs.map((p) => `<p>${p.innerHTML}</p>`).join('');
      info.title = buildTitle(info);
      recaps.push(info);
    });
    // Sort by game number descending (latest game first)
    recaps.sort((a, b) => b.game - a.game);
    return recaps.length > 0 ? recaps : null;
  } catch { return null; }
}

const INITIAL_SHOW = 2;

function renderRecaps(block, recaps, showAll) {
  block.textContent = '';

  if (!recaps || recaps.length === 0) {
    block.innerHTML = `<p class="recaps-empty">${t('noRecaps')}</p>`;
    return;
  }

  const cardList = document.createElement('div');
  cardList.className = 'recaps-list';

  recaps.forEach((r, i) => {
    const title = buildTitle(r);
    const translatedBody = getRecapBody(r.game);
    const body = translatedBody || r.body;

    const card = document.createElement('article');
    card.className = 'recap-card';
    card.dataset.game = r.game;
    if (!showAll && i >= INITIAL_SHOW) card.style.display = 'none';
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

  block.append(cardList);

  // Show "View All Recaps" button if there are more than INITIAL_SHOW
  if (!showAll && recaps.length > INITIAL_SHOW) {
    const viewAllBtn = document.createElement('button');
    viewAllBtn.className = 'recaps-view-all-btn';
    viewAllBtn.textContent = `${t('allGames')} (${recaps.length})`;
    viewAllBtn.addEventListener('click', () => {
      block.showAllRecaps = true;
      renderRecaps(block, recaps, true);
    });
    block.append(viewAllBtn);
  }
}

export default async function decorate(block) {
  block.textContent = '';
  block.showAllRecaps = false;

  const recaps = await fetchRecaps();
  renderRecaps(block, recaps, false);

  document.addEventListener('lang-change', () => {
    renderRecaps(block, recaps, block.showAllRecaps || false);
  });
}
