function parseHeading(text) {
  // Format: "Game 1 — W 12-1 vs 905 Tedeschi Reds — Sat, Apr 18"
  const match = text.match(/^Game\s+(\d+)\s*[—–-]\s*(W|L|T)\s+([\d]+-[\d]+)\s+vs\s+(.+?)\s*[—–-]\s*(.+)$/i);
  if (!match) return null;
  return {
    game: Number(match[1]),
    resultClass: match[2].toUpperCase() === 'W' ? 'win' : match[2].toUpperCase() === 'L' ? 'loss' : 'tie',
    result: `${match[2].toUpperCase()} ${match[3]}`,
    opponent: match[4].trim(),
    date: match[5].trim(),
  };
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
      info.summary = paragraphs.map((p) => p.innerHTML).join('');
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

  // Recap cards
  const cardList = document.createElement('div');
  cardList.className = 'recaps-list';

  recaps.forEach((r) => {
    const card = document.createElement('div');
    card.className = 'recap-card';
    card.dataset.game = r.game;

    card.innerHTML = `
      <div class="recap-header">
        <div class="recap-game-info">
          <span class="recap-game-num">Game ${r.game}</span>
          <span class="recap-date">${r.date}</span>
        </div>
        <div class="recap-matchup">
          <span class="recap-opponent">vs ${r.opponent}</span>
          <span class="recap-result ${r.resultClass}">${r.result}</span>
        </div>
      </div>
      <div class="recap-body">${r.summary}</div>
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
