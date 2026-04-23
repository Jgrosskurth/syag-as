function parseHeading(text) {
  // Format: "Game 1 — W 12-1 vs 905 Tedeschi Reds — Sat, Apr 18"
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
  if (info.wl === 'W') {
    return `A's Take Down ${info.opponent} ${info.score}`;
  }
  if (info.wl === 'L') {
    return `A's With Tough Game Against ${info.opponent}`;
  }
  return `A's Tie ${info.opponent} ${info.score}`;
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
  } catch {
    return null;
  }
}

export default async function decorate(block) {
  block.textContent = '';

  const recaps = await fetchRecaps();
  if (!recaps || recaps.length === 0) {
    block.innerHTML = '<p class="recaps-empty">No game recaps yet. Check back after the next game!</p>';
    return;
  }

  // Filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'recaps-filter';
  const allBtn = document.createElement('button');
  allBtn.className = 'recaps-filter-btn active';
  allBtn.textContent = 'All Games';
  allBtn.dataset.game = 'all';
  filterBar.append(allBtn);

  recaps.forEach((r) => {
    const btn = document.createElement('button');
    btn.className = 'recaps-filter-btn';
    btn.textContent = `Game ${r.game}`;
    btn.dataset.game = r.game;
    filterBar.append(btn);
  });

  // Recap articles
  const cardList = document.createElement('div');
  cardList.className = 'recaps-list';

  recaps.forEach((r) => {
    const card = document.createElement('article');
    card.className = 'recap-card';
    card.dataset.game = r.game;

    card.innerHTML = `
      <div class="recap-header">
        <h3 class="recap-title">${r.title}</h3>
        <p class="recap-subtitle">${r.date} vs. ${r.opponent}</p>
        <span class="recap-badge ${r.resultClass}">${r.result}</span>
      </div>
      <div class="recap-body">${r.body}</div>
    `;
    cardList.append(card);
  });

  block.append(filterBar, cardList);

  // Filter logic
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.recaps-filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.recaps-filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const game = btn.dataset.game;
    cardList.querySelectorAll('.recap-card').forEach((card) => {
      card.style.display = (game === 'all' || card.dataset.game === game) ? '' : 'none';
    });
  });
}
