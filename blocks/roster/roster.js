export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'roster-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'roster-card';

    const number = cells[0]?.textContent?.trim() || '';
    const name = cells[1]?.textContent?.trim() || '';
    const position = cells[2]?.textContent?.trim() || '';

    card.innerHTML = `
      <div class="roster-card-number">${number}</div>
      <div class="roster-card-info">
        <div class="roster-card-name">${name}</div>
        <div class="roster-card-position">${position}</div>
      </div>
    `;
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
