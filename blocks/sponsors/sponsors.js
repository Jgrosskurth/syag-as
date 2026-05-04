import { t } from '../../scripts/i18n.js';

const TIERS = [
  {
    key: 'platinum',
    icon: '💎',
    color: '#e5e4e2',
    benefits: ['sponsorBenefitPlatinum1', 'sponsorBenefitPlatinum2', 'sponsorBenefitPlatinum3', 'sponsorBenefitPlatinum4'],
  },
  {
    key: 'gold',
    icon: '🥇',
    color: '#c8a415',
    benefits: ['sponsorBenefitGold1', 'sponsorBenefitGold2', 'sponsorBenefitGold3'],
  },
  {
    key: 'silver',
    icon: '🥈',
    color: '#a0a0a0',
    benefits: ['sponsorBenefitSilver1', 'sponsorBenefitSilver2'],
  },
];

function renderTiers() {
  return TIERS.map((tier) => `
    <div class="sponsor-tier sponsor-tier-${tier.key}">
      <div class="sponsor-tier-header" style="border-color: ${tier.color}">
        <span class="sponsor-tier-icon">${tier.icon}</span>
        <h3 class="sponsor-tier-name">${t(`sponsorTier${tier.key.charAt(0).toUpperCase() + tier.key.slice(1)}`)}</h3>
      </div>
      <ul class="sponsor-tier-benefits">
        ${tier.benefits.map((b) => `<li>${t(b)}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderForm() {
  return `
    <div class="sponsor-form-wrap">
      <h3 class="sponsor-form-title">${t('sponsorFormTitle')}</h3>
      <p class="sponsor-form-desc">${t('sponsorFormDesc')}</p>
      <form class="sponsor-form" id="sponsor-form">
        <div class="sponsor-form-row">
          <input type="text" name="name" placeholder="${t('sponsorFieldName')}" required>
          <input type="email" name="email" placeholder="${t('sponsorFieldEmail')}" required>
        </div>
        <div class="sponsor-form-row">
          <input type="text" name="business" placeholder="${t('sponsorFieldBusiness')}" required>
          <select name="tier" required>
            <option value="" disabled selected>${t('sponsorFieldTier')}</option>
            <option value="platinum">${t('sponsorTierPlatinum')}</option>
            <option value="gold">${t('sponsorTierGold')}</option>
            <option value="silver">${t('sponsorTierSilver')}</option>
          </select>
        </div>
        <textarea name="message" rows="3" placeholder="${t('sponsorFieldMessage')}"></textarea>
        <button type="submit" class="sponsor-submit">${t('sponsorSubmit')}</button>
      </form>
      <div class="sponsor-form-success" style="display:none">
        <span class="sponsor-success-icon">✅</span>
        <p>${t('sponsorSuccess')}</p>
      </div>
    </div>
  `;
}

export default function decorate(block) {
  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'sponsors-container';
  container.innerHTML = `
    <p class="sponsors-intro">${t('sponsorIntro')}</p>
    <div class="sponsor-tiers">${renderTiers()}</div>
    ${renderForm()}
  `;

  block.append(container);

  // Form submission
  const form = container.querySelector('#sponsor-form');
  const successMsg = container.querySelector('.sponsor-form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Sponsorship Inquiry - ${data.get('tier')} - ${data.get('business')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBusiness: ${data.get('business')}\nTier: ${data.get('tier')}\nMessage: ${data.get('message') || 'N/A'}`,
    );
    window.open(`mailto:jgrosskurth@gmail.com?subject=${subject}&body=${body}`, '_self');
    form.style.display = 'none';
    successMsg.style.display = 'block';
  });

  // Re-render on language change
  document.addEventListener('lang-change', () => {
    container.innerHTML = `
      <p class="sponsors-intro">${t('sponsorIntro')}</p>
      <div class="sponsor-tiers">${renderTiers()}</div>
      ${renderForm()}
    `;
    const newForm = container.querySelector('#sponsor-form');
    const newSuccess = container.querySelector('.sponsor-form-success');
    newForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const d = new FormData(newForm);
      const subj = encodeURIComponent(`Sponsorship Inquiry - ${d.get('tier')} - ${d.get('business')}`);
      const bd = encodeURIComponent(`Name: ${d.get('name')}\nEmail: ${d.get('email')}\nBusiness: ${d.get('business')}\nTier: ${d.get('tier')}\nMessage: ${d.get('message') || 'N/A'}`);
      window.open(`mailto:jgrosskurth@gmail.com?subject=${subj}&body=${bd}`, '_self');
      newForm.style.display = 'none';
      newSuccess.style.display = 'block';
    });
  });
}
