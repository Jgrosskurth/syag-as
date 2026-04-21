export default async function decorate(block) {
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class="header-top">
      <div class="team-logo">A's</div>
      <div class="team-info">
        <div class="team-name">The A's</div>
        <div class="team-subtitle">2026 SYAG Baseball</div>
        <div class="team-record">1 - 0</div>
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

  // Tab click handling
  wrapper.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      wrapper.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}
