import { t } from '../../scripts/i18n.js';

export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'resources-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    let icon; let title; let desc; let link; let linkText;

    if (cells.length >= 4) {
      icon = cells[0]?.textContent?.trim() || '🔗';
      title = cells[1]?.textContent?.trim() || '';
      desc = cells[2]?.textContent?.trim() || '';
      const linkEl = cells[3]?.querySelector('a');
      link = linkEl?.href || '#';
      linkText = linkEl?.textContent?.trim() || t('visitLink');
    } else {
      title = cells[0]?.textContent?.trim() || '';
      desc = cells[1]?.textContent?.trim() || '';
      const linkEl = cells[2]?.querySelector('a');
      link = linkEl?.href || '#';
      linkText = linkEl?.textContent?.trim() || t('visitLink');
      icon = '🔗';
    }

    const card = document.createElement('a');
    card.className = 'resource-card';
    card.href = link;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <div class="resource-icon">${icon}</div>
      <div class="resource-content">
        <div class="resource-title">${title}</div>
        <div class="resource-desc">${desc}</div>
      </div>
      <span class="resource-link">${linkText} →</span>
    `;
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
