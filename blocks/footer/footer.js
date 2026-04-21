export default async function decorate(block) {
  block.textContent = '';
  const footer = document.createElement('div');
  footer.innerHTML = `
    <div class="footer-inner">
      <p class="footer-team">SYAG A's</p>
      <p class="footer-info">2026 Season · Sachem Youth Advisory Group</p>
    </div>
  `;
  block.append(footer);
}
