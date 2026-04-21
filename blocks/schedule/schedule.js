function loadGCScript() {
  return new Promise((resolve, reject) => {
    if (window.GC) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://widgets.gc.com/static/js/sdk.v1.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

export default async function decorate(block) {
  block.textContent = '';

  const target = document.createElement('div');
  target.id = 'gc-schedule-widget-4tul';
  block.append(target);

  try {
    await loadGCScript();
    window.GC.team.schedule.init({
      target: '#gc-schedule-widget-4tul',
      widgetId: '836257c4-d374-455e-9783-4ddb13ec6087',
      maxVerticalGamesVisible: 4,
    });
  } catch (e) {
    target.textContent = 'Unable to load schedule. Visit GameChanger for the latest.';
  }
}
