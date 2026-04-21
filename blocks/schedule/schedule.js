export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  table.className = 'schedule-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Date</th><th>Time</th><th>Opponent</th><th>Location</th><th>H/A</th><th>Result</th></tr>';
  table.append(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');
    const date = cells[0]?.textContent?.trim() || '';
    const time = cells[1]?.textContent?.trim() || '';
    const opponent = cells[2]?.textContent?.trim() || '';
    const location = cells[3]?.textContent?.trim() || '';
    const ha = cells[4]?.textContent?.trim() || '';
    const result = cells[5]?.textContent?.trim() || '—';

    const haClass = ha.toLowerCase() === 'home' ? 'home' : ha.toLowerCase() === 'away' ? 'away' : 'bye';
    const resultClass = result.startsWith('W') ? 'win' : result.startsWith('L') ? 'loss' : '';

    tr.innerHTML = `
      <td class="sched-date">${date}</td>
      <td>${time}</td>
      <td class="sched-opponent">${opponent}</td>
      <td class="sched-location">${location}</td>
      <td><span class="sched-badge ${haClass}">${ha}</span></td>
      <td class="sched-result ${resultClass}">${result}</td>
    `;
    tbody.append(tr);
  });

  table.append(tbody);
  block.textContent = '';
  block.append(table);
}
