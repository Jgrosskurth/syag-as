import { t } from '../../scripts/i18n.js';

const GC_TEAM_ID = 'ytegAXE9ZttI';
const GC_GAMES_API = `https://api.team-manager.gc.com/public/teams/${GC_TEAM_ID}/games/preview`;
const GC_TEAM_URL = `https://web.gc.com/teams/${GC_TEAM_ID}`;

function renderPlaceholder() {
  return `
    <div class="livestream-placeholder">
      <div class="livestream-icon">📺</div>
      <div class="livestream-message">
        <div class="livestream-title">${t('liveTitle')}</div>
        <p>${t('liveMsg1')}</p>
        <p>${t('liveMsg2')}</p>
      </div>
      <a href="${GC_TEAM_URL}" target="_blank" rel="noopener" class="livestream-link">
        ${t('openGC')}
      </a>
    </div>
  `;
}

export default async function decorate(block) {
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'livestream-container';

  let liveGame = null;
  try {
    const resp = await fetch(GC_GAMES_API);
    if (resp.ok) {
      const games = await resp.json();
      liveGame = games.find((g) => g.has_live_stream || g.game_status === 'in_progress');
    }
  } catch { /* CORS may block */ }

  if (liveGame) {
    const iframe = document.createElement('iframe');
    iframe.src = GC_TEAM_URL;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'livestream-iframe';
    container.append(iframe);
  } else {
    container.innerHTML = renderPlaceholder();
  }

  block.append(container);

  document.addEventListener('lang-change', () => {
    if (!liveGame) container.innerHTML = renderPlaceholder();
  });
}
