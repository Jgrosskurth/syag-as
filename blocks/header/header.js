import { t, getLang, toggleLang } from '../../scripts/i18n.js';

function computeRecord() {
  const schedule = document.querySelector('.schedule');
  if (!schedule) return null;
  let win = 0;
  let loss = 0;
  let tie = 0;
  schedule.querySelectorAll('.sched-result').forEach((el) => {
    const text = el.textContent.trim();
    if (text.startsWith('W')) win += 1;
    else if (text.startsWith('L')) loss += 1;
    else if (text.startsWith('T')) tie += 1;
  });
  if (win === 0 && loss === 0 && tie === 0) return null;
  return tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
}

function buildNav() {
  return `
    <div class="header-top">
      <div class="team-logo">A's</div>
      <div class="team-info">
        <div class="team-name">${t('teamName')}</div>
        <div class="team-subtitle">${t('teamSubtitle')}</div>
        <div class="team-record"></div>
      </div>
      <button class="lang-toggle" aria-label="Toggle language">
        ${getLang() === 'en' ? 'ES' : 'EN'}
      </button>
    </div>
    <div class="nav-tabs">
      <a href="#roster" class="nav-tab active">${t('roster')}</a>
      <a href="#schedule" class="nav-tab">${t('schedule')}</a>
      <a href="#stats" class="nav-tab">${t('stats')}</a>
      <a href="#livestream" class="nav-tab">${t('live')}</a>
      <a href="#recaps" class="nav-tab">${t('recaps')}</a>
      <a href="#resources" class="nav-tab">${t('resources')}</a>
    </div>
  `;
}

export default async function decorate(block) {
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.innerHTML = buildNav();

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  // Language toggle
  wrapper.querySelector('.lang-toggle').addEventListener('click', () => {
    toggleLang();
  });

  // Re-render header on language change
  document.addEventListener('lang-change', () => {
    nav.innerHTML = buildNav();
    wrapper.querySelector('.lang-toggle').addEventListener('click', () => {
      toggleLang();
    });
    // Reattach tab click handlers
    attachTabHandlers();
    updateRecord();
  });

  // Update record once schedule block loads
  const updateRecord = () => {
    const recordEl = wrapper.querySelector('.team-record');
    if (!recordEl) return;
    const record = computeRecord();
    if (record) recordEl.textContent = record;
  };

  let attempts = 0;
  const check = setInterval(() => {
    updateRecord();
    attempts += 1;
    if ((wrapper.querySelector('.team-record')?.textContent) || attempts > 20) clearInterval(check);
  }, 500);

  // Tab click handling
  function attachTabHandlers() {
    wrapper.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.querySelectorAll('.nav-tab').forEach((tt) => tt.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  attachTabHandlers();
}
