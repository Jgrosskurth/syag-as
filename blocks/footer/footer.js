import { t } from '../../scripts/i18n.js';

function renderFooter() {
  return `
    <div class="footer-inner">
      <p class="footer-team">${t('footerLine1')}</p>
      <p class="footer-info">${t('footerLine2')}</p>
    </div>
  `;
}

export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  footer.innerHTML = renderFooter();
  block.append(footer);

  document.addEventListener('lang-change', () => {
    footer.innerHTML = renderFooter();
  });
}
