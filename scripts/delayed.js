// delayed loading

// Update team record from schedule results
(function updateRecord() {
  const record = document.querySelector('.team-record');
  if (!record) return;
  const schedule = document.querySelector('.schedule');
  if (!schedule) return;
  let win = 0;
  let loss = 0;
  let tie = 0;
  schedule.querySelectorAll('.sched-result').forEach((el) => {
    const text = el.textContent.trim();
    if (text.startsWith('W')) win += 1;
    else if (text.startsWith('L')) loss += 1;
    else if (text.startsWith('T')) tie += 1;
  });
  if (win > 0 || loss > 0 || tie > 0) {
    record.textContent = tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
  }
}());
