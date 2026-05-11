import { t, getLang } from './i18n.js';

// PWA: Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// PWA: Install banner (mobile only, dismissible with cookie)
(function initPWABanner() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone;
  if (isStandalone) return;
  if (document.cookie.includes('pwa-banner-dismissed=1')) return;
  if (window.innerWidth > 768) return;

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-banner-content">
      <div class="pwa-banner-logo">A's</div>
      <button class="pwa-banner-install">Install App</button>
      <button class="pwa-banner-close" aria-label="Close">&times;</button>
    </div>
  `;

  const header = document.querySelector('header');
  if (header) {
    header.prepend(banner);
  } else {
    document.body.prepend(banner);
  }

  function dismiss() {
    banner.remove();
    document.cookie = 'pwa-banner-dismissed=1; path=/; max-age=2592000; SameSite=Lax';
  }

  banner.querySelector('.pwa-banner-close').addEventListener('click', dismiss);

  banner.querySelector('.pwa-banner-install').addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
      dismiss();
    } else {
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const msg = isIOS
        ? 'Tap the Share button, then "Add to Home Screen"'
        : 'Tap the menu (⋮) then "Add to Home Screen"';
      alert(msg);
      dismiss();
    }
  });
}());

// Update team record — try DOM first, then retry with polling
(function updateRecord() {
  const record = document.querySelector('.team-record');
  if (!record) return;

  function computeFromDOM() {
    let win = 0;
    let loss = 0;
    let tie = 0;
    document.querySelectorAll('.sched-result').forEach((el) => {
      const text = el.textContent.trim();
      if (text.startsWith('W')) win += 1;
      else if (text.startsWith('L')) loss += 1;
      else if (text.startsWith('T')) tie += 1;
    });
    if (win > 0 || loss > 0 || tie > 0) {
      record.textContent = tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
      return true;
    }
    return false;
  }

  // Poll until schedule renders (API-loaded blocks are async)
  let attempts = 0;
  const interval = setInterval(() => {
    if (computeFromDOM() || attempts > 30) clearInterval(interval);
    attempts += 1;
  }, 500);
}());

// Section heading translation map (h2 id -> i18n key)
const HEADING_MAP = {
  roster: 'h-2026-roster',
  'season-schedule': 'h-season-schedule',
  'player-stats': 'h-player-stats',
  livestream: 'h-livestream',
  'game-recaps': 'h-game-recaps',
  sponsors: 'h-sponsors',
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
    if (key) {
      const savedId = id;
      h2.textContent = t(key);
      h2.id = savedId;
    }
  });
}

function translateScheduleDesc() {
  const schedSection = document.getElementById('schedule');
  if (!schedSection) return;
  const p = schedSection.querySelector('.default-content-wrapper p');
  if (!p) return;
  const link = p.querySelector('a');
  if (link) {
    const linkHTML = link.outerHTML;
    p.innerHTML = `${t('scheduleDesc')} ${linkHTML}.`;
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

// Only translate on load if language is NOT English (English is the DA default)
if (getLang() !== 'en') {
  translateAll();
}

// Re-translate on language change
document.addEventListener('lang-change', () => {
  translateAll();
});
