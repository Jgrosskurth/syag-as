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
  card.dataset.startTs = game.start_ts;
  card.dataset.completed = game.game_status === 'completed' ? 'true' : 'false';
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

/**
 * Find the last completed game card in the track and sticky it to the front
 * with a highlighted "LAST GAME" treatment.
 */
function stickyLastGame(track) {
  const cards = [...track.querySelectorAll('.schedule-card.played')];
  if (cards.length === 0) return;
  const lastGameCard = cards[cards.length - 1];
  lastGameCard.classList.add('last-game');
  const label = document.createElement('div');
  label.className = 'sched-last-game-label';
  label.textContent = 'LAST GAME';
  lastGameCard.prepend(label);
  track.prepend(lastGameCard);
}

function renderFromDA(block) {
  const rows = [...block.children];
  const track = document.createElement('div');
  track.className = 'schedule-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const date = cells[0]?.textContent?.trim() || '';
    const time = cells[1]?.textContent?.trim() || '';
    const opponent = cells[2]?.textContent?.trim() || '';
    const location = cells[3]?.textContent?.trim() || '';
    const ha = cells[4]?.textContent?.trim() || '';
    const result = cells[5]?.textContent?.trim() || '\u2014';

    const haLower = ha.toLowerCase();
    const haClass = haLower === 'home' ? 'home' : haLower === 'away' ? 'away' : 'bye';
    const isPostponed = result.toLowerCase().startsWith('ppd') || result.toLowerCase().startsWith('postponed');
    const hasResult = !isPostponed && result !== '\u2014' && result !== '';
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
      ${isPostponed ? '<div class="sched-ppd">PPD \u2014 Rain</div>' : ''}
      ${hasResult ? `<div class="sched-result ${resultClass}">${result}</div>` : ''}
    `;
    track.append(card);
  });

  block.textContent = '';
  block.append(track);
  stickyLastGame(track);
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
    stickyLastGame(track);
    return;
  } catch {
    // CORS blocked or API error, fall back to DA content
  }

  renderFromDA(block);
}

