const GC_TEAM_ID = 'ytegAXE9ZttI';
const GC_GAMES_API = `https://api.team-manager.gc.com/public/teams/${GC_TEAM_ID}/games/preview`;
const GC_TEAM_URL = `https://web.gc.com/teams/${GC_TEAM_ID}`;

export default async function decorate(block) {
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'livestream-container';

  // Check if any game has a live stream or is in progress
  let liveGame = null;
  try {
    const resp = await fetch(GC_GAMES_API);
    if (resp.ok) {
      const games = await resp.json();
      liveGame = games.find((g) => g.has_live_stream || g.game_status === 'in_progress');
    }
  } catch { /* CORS may block - fall through */ }

  if (liveGame) {
    const iframe = document.createElement('iframe');
    iframe.src = GC_TEAM_URL;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'livestream-iframe';
    container.append(iframe);
  } else {
    container.innerHTML = `
      <div class="livestream-placeholder">
        <div class="livestream-icon">📺</div>
        <div class="livestream-message">
          <div class="livestream-title">Live Game Stream</div>
          <p>When a game is live on GameChanger, the stream will appear here automatically.</p>
          <p>Subscribe on the GameChanger app to enable live streaming for all games.</p>
        </div>
        <a href="${GC_TEAM_URL}" target="_blank" rel="noopener" class="livestream-link">
          Open GameChanger →
        </a>
      </div>
    `;
  }

  block.append(container);
}
