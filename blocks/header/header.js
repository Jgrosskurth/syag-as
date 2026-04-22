const GC_TEAM_API = 'https://api.team-manager.gc.com/public/teams/ytegAXE9ZttI';

async function fetchRecord() {
  try {
    const resp = await fetch(GC_TEAM_API);
    if (!resp.ok) throw new Error(resp.status);
    const data = await resp.json();
    const { win, loss, tie } = data.team_season?.record || {};
    if (win !== undefined && loss !== undefined) {
      return tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
    }
  } catch { /* fall through */ }
  return null;
}

export default async function decorate(block) {
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="header-top">
      <div class="team-logo">A's</div>
      <div class="team-info">
        <div class="team-name">The A's</div>
        <div class="team-subtitle">2026 SYAG Baseball</div>
        <div class="team-record">...</div>
      </div>
    </div>
    <div class="nav-tabs">
      <a href="#roster" class="nav-tab active">Roster</a>
      <a href="#schedule" class="nav-tab">Schedule</a>
      <a href="#stats" class="nav-tab">Stats</a>
      <a href="#resources" class="nav-tab">Resources</a>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  // Fetch live record from GameChanger
  const record = await fetchRecord();
  const recordEl = wrapper.querySelector('.team-record');
  if (record) {
    recordEl.textContent = record;
  } else {
    recordEl.textContent = '';
  }

  // Tab click handling with smooth scroll
  wrapper.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      wrapper.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
