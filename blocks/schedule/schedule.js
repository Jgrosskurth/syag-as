import { t } from '../../scripts/i18n.js';

function translateHA(ha) {
  const lower = ha.toLowerCase();
  if (lower === 'home') return t('home');
  if (lower === 'away') return t('away');
  if (lower === 'bye') return t('bye');
  return ha;
}

export default function decorate(block) {
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
      ${isPostponed ? '<div class="sched-ppd">PPD — Rain</div>' : ''}
      ${hasResult ? `<div class="sched-result ${resultClass}">${result}</div>` : ''}
    `;
    track.append(card);
  });

  block.textContent = '';
  block.append(track);
}
