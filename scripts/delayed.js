import { t } from './i18n.js';

// Update team record from schedule results
(function updateRecord() {
  const record = document.querySelector('.team-record');
  if (!record) return;
  const schedule = document.querySelector('.schedule');
  if (!schedule) return;
  let win = 0;
  let loss = 0;
  let tie = 0;
  schedule.querySelectorAll('.sched-result').forEach((el) => {
    const text = el.textContent.trim();
    if (text.startsWith('W')) win += 1;
    else if (text.startsWith('L')) loss += 1;
    else if (text.startsWith('T')) tie += 1;
  });
  if (win > 0 || loss > 0 || tie > 0) {
    record.textContent = tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
  }
}());

// Section heading translation map (h2 id -> i18n key)
const HEADING_MAP = {
  roster: 'h-2026-roster',
  'season-schedule': 'h-season-schedule',
  'player-stats': 'h-player-stats',
  livestream: 'h-livestream',
  'game-recaps': 'h-game-recaps',
  'team-resources': 'h-team-resources',
};

// Resource card translation (by index)
const RESOURCE_KEYS = [
  { title: 'res-syag-title', desc: 'res-syag-desc' },
  { title: 'res-gc-title', desc: 'res-gc-desc' },
  { title: 'res-groupme-title', desc: 'res-groupme-desc' },
  { title: 'res-rules-title', desc: 'res-rules-desc' },
];

function translateSectionHeadings() {
  document.querySelectorAll('main .default-content-wrapper h2').forEach((h2) => {
    const id = h2.id || h2.getAttribute('id');
    const key = HEADING_MAP[id];
    if (key) h2.textContent = t(key);
  });
}

function translateScheduleDesc() {
  const schedSection = document.getElementById('schedule');
  if (!schedSection) return;
  const p = schedSection.querySelector('.default-content-wrapper p');
  if (!p) return;
  const link = p.querySelector('a');
  if (link) {
    p.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent.trim().length > 5) {
        node.textContent = `${t('scheduleDesc')} `;
      }
    });
    const after = link.nextSibling;
    if (after && after.nodeType === 3) after.textContent = '.';
  }
}

function translateResourceCards() {
  const cards = document.querySelectorAll('.resources .resource-card');
  cards.forEach((card, i) => {
    if (!RESOURCE_KEYS[i]) return;
    const titleEl = card.querySelector('.resource-title');
    const descEl = card.querySelector('.resource-desc');
    const linkEl = card.querySelector('.resource-link');
    if (titleEl) titleEl.textContent = t(RESOURCE_KEYS[i].title);
    if (descEl) descEl.textContent = t(RESOURCE_KEYS[i].desc);
    if (linkEl) linkEl.textContent = t('visitLink');
  });
}

function translateAll() {
  translateSectionHeadings();
  translateScheduleDesc();
  translateResourceCards();
}

// Translate on load if not English
translateAll();

// Re-translate on language change
document.addEventListener('lang-change', () => {
  translateAll();
});
