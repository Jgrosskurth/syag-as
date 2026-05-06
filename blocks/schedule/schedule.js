import { t } from '../../scripts/i18n.js';

const GC_TEAM_ID = 'ytegAXE9ZttI';
const GC_API = `https://api.team-manager.gc.com/public/teams/${GC_TEAM_ID}/games/preview`;

function translateHA(ha) {
  const lower = ha.toLowerCase();
  if (lower === 'home') return t('home');
  if (lower === 'away') return t('away');
  if (lower === 'bye') return t('bye');
  return ha;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/New_York' });
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
}

function getResult(game) {
  if (game.game_status !== 'completed' || !game.score) return '';
  const teamScore = game.score.team;
  const oppScore = game.score.opponent_team;
  if (teamScore > oppScore) return `W ${teamScore}-${oppScore}`;
  if (teamScore < oppScore) return `L ${teamScore}-${oppScore}`;
  return `T ${teamScore}-${oppScore}`;
}

function renderCard(game) {
  const date = formatDate(game.start_ts);
  const time = game.game_status !== 'completed' ? formatTime(game.start_ts) : '';
  const opponent = game.opponent_team.name;
  const ha = game.home_away || '';
  const haClass = ha === 'home' ? 'home' : ha === 'away' ? 'away' : 'bye';
  const result = getResult(game);
  const hasResult = result !== '';
  const isWin = result.startsWith('W');
  const isLoss = result.startsWith('L');
  const resultClass = isWin ? 'win' : isLoss ? 'loss' : '';

  const card = document.createElement('div');
  card.className = `schedule-card ${haClass}${hasResult ? ` played ${resultClass}` : ''}`;
  card.innerHTML = `
    <div class="sched-date">${date}</div>
    ${time ? `<div class="sched-time">${time}</div>` : ''}
    <div class="sched-opponent">${opponent}</div>
    <div class="sched-meta">
      <span class="sched-badge ${haClass}">${translateHA(ha)}</span>
    </div>
    ${hasResult ? `<div class="sched-result ${resultClass}">${result}</div>` : ''}
  `;
  return card;
}

function buildDACard(cells) {
  const date = cells[0]?.textContent?.trim() || '';
  const time = cells[1]?.textContent?.trim() || '';
  const opponent = cells[2]?.textContent?.trim() || '';
  const location = cells[3]?.textContent?.trim() || '';
  const ha = cells[4]?.textContent?.trim() || '';
  const result = cells[5]?.textContent?.trim() || '—';

  const haLower = ha.toLowerCase();
  const haClass = haLower === 'home' ? 'home' : haLower === 'away' ? 'away' : 'bye';
  const isPostponed = result.toLowerCase().startsWith('ppd') || result.toLowerCase().startsWith('postponed');
  const hasResult = !isPostponed && result !== '—' && result !== '';
  const isWin = result.startsWith('W');
  const resultClass = hasResult ? (isWin ? 'win' : 'loss') : '';

  const card = document.createElement('div');
  card.className = `schedule-card ${haClass}${hasResult ? ` played ${resultClass}` : ''}${isPostponed ? ' postponed' : ''}`;
  card.innerHTML = `
    <div class="sched-date${isPostponed ? ' sched-date-ppd' : ''}">${date}</div>
    ${time ? `<div class="sched-time">${time}</div>` : ''}
    <div class="sched-opponent">${opponent}</div>
    <div class="sched-meta">
      <span class="sched-badge ${haClass}">${translateHA(ha)}</span>
      <span class="sched-location">${location}</span>
    </div>
    ${isPostponed ? '<div class="sched-ppd">PPD – Rain</div>' : ''}
    ${hasResult ? `<div class="sched-result ${resultClass}">${result}</div>` : ''}
  `;

  return { card, hasResult, isPostponed };
}

function parseGameDate(dateStr) {
  const cleaned = dateStr.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s*/i, '');
  const withYear = `${cleaned}, 2026`;
  const parsed = new Date(withYear);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  return null;
}

function renderFromDA(block) {
  const rows = [...block.children];
  const cards = rows.map((row) => {
    const cells = [...row.children];
    const dateStr = cells[0]?.textContent?.trim() || '';
    return { cells, dateStr, ...buildDACard(cells) };
  });

  // Find the most recent game that has already been played (date <= today)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  let lastGameIndex = -1;
  for (let i = cards.length - 1; i >= 0; i -= 1) {
    const gameDate = parseGameDate(cards[i].dateStr);
    if (gameDate && gameDate <= today) {
      lastGameIndex = i;
      break;
    }
  }

  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'schedule-track';

  if (lastGameIndex >= 0) {
    const lastCard = cards[lastGameIndex].card;
    lastCard.classList.add('last-game-card');

    const label = document.createElement('span');
    label.className = 'last-game-label';
    label.textContent = t('lastGame') || 'LAST GAME';
    lastCard.prepend(label);

    track.append(lastCard);

    const divider = document.createElement('div');
    divider.className = 'schedule-divider';
    track.append(divider);

    cards.forEach(({ card }, i) => {
      if (i !== lastGameIndex) track.append(card);
    });
  } else {
    cards.forEach(({ card }) => track.append(card));
  }

  block.append(track);
}

export default async function decorate(block) {
  try {
    const resp = await fetch(GC_API);
    if (!resp.ok) throw new Error(resp.status);
    const games = await resp.json();
    if (!Array.isArray(games) || games.length === 0) throw new Error('empty');

    block.textContent = '';
    const track = document.createElement('div');
    track.className = 'schedule-track';
    games.forEach((game) => track.append(renderCard(game)));
    block.append(track);
    return;
  } catch {
    // CORS blocked or API error - fall back to DA content
  }

  renderFromDA(block);
}
