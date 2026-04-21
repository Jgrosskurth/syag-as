export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'resources-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const icon = cells[0]?.textContent?.trim() || '';
    const title = cells[1]?.textContent?.trim() || '';
    const desc = cells[2]?.textContent?.trim() || '';
    const link = cells[3]?.querySelector('a')?.href || cells[3]?.textContent?.trim() || '#';

    const card = document.createElement('a');
    card.className = 'resource-card';
    card.href = link;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <div class="resource-icon">${icon}</div>
      <div class="resource-title">${title}</div>
      <div class="resource-desc">${desc}</div>
      <span class="resource-link">Visit →</span>
    `;
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
