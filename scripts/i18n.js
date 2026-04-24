const TRANSLATIONS = {
  en: {
    teamName: "The A's",
    teamSubtitle: '2026 SYAG Baseball',
    roster: 'Roster',
    schedule: 'Schedule',
    stats: 'Stats',
    live: 'Live',
    recaps: 'Recaps',
    resources: 'Resources',
    statsTip: 'Tap a column to sort. Stats from GameChanger.',
    sortBy: 'Sort by',
    teamTotals: 'Team Totals',
    allGames: 'All Games',
    game: 'Game',
    vs: 'vs',
    liveTitle: 'Live Game Stream',
    liveMsg1: 'When a game is live on GameChanger, the stream will appear here automatically.',
    liveMsg2: 'Subscribe on the GameChanger app to enable live streaming for all games.',
    openGC: 'Open GameChanger →',
    noRecaps: 'No game recaps yet. Check back after the next game!',
    footerLine1: "SYAG A's",
    footerLine2: '2026 Season · Sachem Youth Advisory Group',
    home: 'Home',
    away: 'Away',
    bye: 'Bye',
    winPrefix: "A's Take Down",
    lossPrefix: "A's With Tough Game Against",
    tiePrefix: "A's Tie",
  },
  es: {
    teamName: "Los A's",
    teamSubtitle: '2026 Béisbol SYAG',
    roster: 'Plantilla',
    schedule: 'Calendario',
    stats: 'Estadísticas',
    live: 'En Vivo',
    recaps: 'Resúmenes',
    resources: 'Recursos',
    statsTip: 'Toca una columna para ordenar. Datos de GameChanger.',
    sortBy: 'Ordenar por',
    teamTotals: 'Totales del Equipo',
    allGames: 'Todos los Juegos',
    game: 'Juego',
    vs: 'vs',
    liveTitle: 'Transmisión en Vivo',
    liveMsg1: 'Cuando un juego esté en vivo en GameChanger, la transmisión aparecerá aquí automáticamente.',
    liveMsg2: 'Suscríbete en la app de GameChanger para habilitar la transmisión en vivo de todos los juegos.',
    openGC: 'Abrir GameChanger →',
    noRecaps: '¡Aún no hay resúmenes de juegos. Vuelve después del próximo juego!',
    footerLine1: "SYAG A's",
    footerLine2: '2026 Temporada · Sachem Youth Advisory Group',
    home: 'Local',
    away: 'Visitante',
    bye: 'Descanso',
    winPrefix: "Los A's Derrotaron a",
    lossPrefix: "Los A's Tuvieron un Juego Difícil Contra",
    tiePrefix: "Los A's Empataron con",
  },
};

const STORAGE_KEY = 'syag-lang';

function getStoredLang() {
  try { return localStorage.getItem(STORAGE_KEY) || 'en'; } catch { return 'en'; }
}

function setStoredLang(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
}

let currentLang = getStoredLang();

export function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || TRANSLATIONS.en[key]
    || key;
}

export function getLang() { return currentLang; }

export function setLang(lang) {
  currentLang = lang;
  setStoredLang(lang);
  document.dispatchEvent(new CustomEvent('lang-change', { detail: { lang } }));
}

export function toggleLang() {
  setLang(currentLang === 'en' ? 'es' : 'en');
}
