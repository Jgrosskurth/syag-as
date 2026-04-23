function computeRecord() {
  // Count W/L/T from schedule block results on the page
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

export default async function decorate(block) {
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="header-top">
      <div class="team-logo">A's</div>
      <div class="team-info">
        <div class="team-name">The A's</div>
        <div class="team-subtitle">2026 SYAG Baseball</div>
        <div class="team-record"></div>
      </div>
    </div>
    <div class="nav-tabs">
      <a href="#roster" class="nav-tab active">Roster</a>
      <a href="#schedule" class="nav-tab">Schedule</a>
      <a href="#stats" class="nav-tab">Stats</a>
      <a href="#livestream" class="nav-tab">Live</a>
      <a href="#resources" class="nav-tab">Resources</a>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  // Update record once schedule block loads
  const recordEl = wrapper.querySelector('.team-record');
  const updateRecord = () => {
    const record = computeRecord();
    if (record) recordEl.textContent = record;
  };

  // Check periodically until schedule renders (lazy-loaded)
  let attempts = 0;
  const check = setInterval(() => {
    updateRecord();
    attempts += 1;
    if (recordEl.textContent || attempts > 20) clearInterval(check);
  }, 500);

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
