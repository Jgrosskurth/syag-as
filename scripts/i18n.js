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
    player: 'Player',
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
    sponsors: 'Sponsors',
    sponsorIntro: 'Support the A\'s! Partner with our team and get your business in front of our community. Choose a sponsorship level below.',
    sponsorTierPlatinum: 'Platinum',
    sponsorTierGold: 'Gold',
    sponsorTierSilver: 'Silver',
    sponsorBenefitPlatinum1: 'Logo on team jerseys',
    sponsorBenefitPlatinum2: 'Featured banner on website',
    sponsorBenefitPlatinum3: 'Social media shoutouts all season',
    sponsorBenefitPlatinum4: 'First pitch opportunity at a game',
    sponsorBenefitGold1: 'Logo on team banner at games',
    sponsorBenefitGold2: 'Listed on website sponsors page',
    sponsorBenefitGold3: 'Social media recognition',
    sponsorBenefitSilver1: 'Listed on website sponsors page',
    sponsorBenefitSilver2: 'Thank you in team communications',
    sponsorFormTitle: 'Become a Sponsor',
    sponsorFormDesc: 'Fill out the form below and our team will reach out with more details.',
    sponsorFieldName: 'Your Name',
    sponsorFieldEmail: 'Email Address',
    sponsorFieldBusiness: 'Business Name',
    sponsorFieldTier: 'Select Sponsorship Level',
    sponsorFieldMessage: 'Additional message (optional)',
    sponsorSubmit: 'Submit Request',
    sponsorSuccess: 'Thank you! We\'ll be in touch shortly about sponsorship details.',
    // Section headings (from DA content)
    'h-2026-roster': '2026 Roster',
    'h-season-schedule': 'Season Schedule',
    'h-player-stats': 'Player Stats',
    'h-livestream': 'Livestream',
    'h-game-recaps': 'Game Recaps',
    'h-sponsors': 'Sponsors',
    'h-team-resources': 'Team Resources',
    // Schedule description
    scheduleDesc: 'April 18 – June 6, 2026 · 15 games scheduled. Follow along live on',
    // Resource cards
    'res-syag-title': 'SYAG Baseball',
    'res-syag-desc': 'Official Sachem Youth Advisory Group page for baseball registration, schedules, rules, field locations, and league news.',
    'res-syag-link': 'Visit SYAG',
    'res-gc-title': 'GameChanger',
    'res-gc-desc': 'Live scoring, play-by-play, streaming, stats, and schedule updates for the A\'s.',
    'res-gc-link': 'Open GameChanger',
    'res-groupme-title': 'GroupMe',
    'res-groupme-desc': 'Team communication hub for parents and coaches.',
    'res-groupme-link': 'Open GroupMe',
    'res-rules-title': 'Rules',
    'res-rules-desc': 'Official rule book link',
    'res-rules-link': 'Open Rule Book',
    visitLink: 'Visit →',
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
    player: 'Jugador',
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
    sponsors: 'Patrocinadores',
    sponsorIntro: '¡Apoya a los A\'s! Asóciate con nuestro equipo y muestra tu negocio a nuestra comunidad. Elige un nivel de patrocinio.',
    sponsorTierPlatinum: 'Platino',
    sponsorTierGold: 'Oro',
    sponsorTierSilver: 'Plata',
    sponsorBenefitPlatinum1: 'Logo en las camisetas del equipo',
    sponsorBenefitPlatinum2: 'Banner destacado en el sitio web',
    sponsorBenefitPlatinum3: 'Menciones en redes sociales toda la temporada',
    sponsorBenefitPlatinum4: 'Oportunidad de primer lanzamiento en un juego',
    sponsorBenefitGold1: 'Logo en la pancarta del equipo en los juegos',
    sponsorBenefitGold2: 'Listado en la página de patrocinadores',
    sponsorBenefitGold3: 'Reconocimiento en redes sociales',
    sponsorBenefitSilver1: 'Listado en la página de patrocinadores',
    sponsorBenefitSilver2: 'Agradecimiento en comunicaciones del equipo',
    sponsorFormTitle: 'Conviértete en Patrocinador',
    sponsorFormDesc: 'Completa el formulario y nuestro equipo te contactará con más detalles.',
    sponsorFieldName: 'Tu Nombre',
    sponsorFieldEmail: 'Correo Electrónico',
    sponsorFieldBusiness: 'Nombre del Negocio',
    sponsorFieldTier: 'Selecciona Nivel de Patrocinio',
    sponsorFieldMessage: 'Mensaje adicional (opcional)',
    sponsorSubmit: 'Enviar Solicitud',
    sponsorSuccess: '¡Gracias! Nos pondremos en contacto pronto con los detalles del patrocinio.',
    // Section headings
    'h-2026-roster': 'Plantilla 2026',
    'h-season-schedule': 'Calendario de Temporada',
    'h-player-stats': 'Estadísticas de Jugadores',
    'h-livestream': 'Transmisión en Vivo',
    'h-game-recaps': 'Resúmenes de Juegos',
    'h-sponsors': 'Patrocinadores',
    'h-team-resources': 'Recursos del Equipo',
    // Schedule description
    scheduleDesc: '18 de abril – 6 de junio, 2026 · 15 juegos programados. Sigue en vivo en',
    // Resource cards
    'res-syag-title': 'Béisbol SYAG',
    'res-syag-desc': 'Página oficial del Sachem Youth Advisory Group para inscripción, calendarios, reglas, ubicación de campos y noticias de la liga.',
    'res-syag-link': 'Visitar SYAG',
    'res-gc-title': 'GameChanger',
    'res-gc-desc': 'Marcadores en vivo, jugada a jugada, transmisión, estadísticas y calendario de los A\'s.',
    'res-gc-link': 'Abrir GameChanger',
    'res-groupme-title': 'GroupMe',
    'res-groupme-desc': 'Centro de comunicación del equipo para padres y entrenadores.',
    'res-groupme-link': 'Abrir GroupMe',
    'res-rules-title': 'Reglas',
    'res-rules-desc': 'Enlace al reglamento oficial',
    'res-rules-link': 'Abrir Reglamento',
    visitLink: 'Visitar →',
  },
};

// Recap body translations (keyed by game number)
const RECAP_TRANSLATIONS = {
  es: {
    1: `<p>Los A's de 906 Grosskurth abrieron el marcador en la parte baja de la primera entrada gracias a tres sencillos. Los A's anotaron primero cuando Matthew conectó un sencillo, impulsando una carrera.</p>
<p>Los A's ampliaron su ventaja en la parte baja de la segunda entrada después de que Connor recibió una base por bolas, Sal recibió una base por bolas, Conor conectó un sencillo al jardín central y Sean recibió una base por bolas, anotando una carrera cada uno.</p>
<p>Los A's agregaron una carrera en la tercera después de que Connor recibió una base por bolas.</p>
<p>Los A's anotaron dos carreras en la parte baja de la quinta con un jonrón al jardín derecho de CJ.</p>
<p>El #30 recibió la derrota por los 905 Tedeschi Reds. El lanzador trabajó cuatro entradas, permitiendo 12 carreras con siete hits, ponchando a 10 y otorgando 11 bases por bolas.</p>
<p>CJ impulsó desde el medio de la alineación, liderando a los A's con dos carreras impulsadas. El campocorto fue de 2-para-2 en el día. CJ y Conor conectaron dos hits cada uno para los A's. Joshua lideró a los A's con dos bases por bolas. En general, el equipo tuvo un buen ojo en el plato, acumulando 11 bases por bolas en el juego. Joshua, Brogan, Matthew y Conor robaron múltiples bases cada uno. Los A's robaron 11 bases en el juego.</p>
<p>El #24 de los 905 Tedeschi Reds, el noveno bateador, lideró a los Reds con dos hits en dos turnos al bate. El #19 robó dos bases.</p>
<p>El próximo juego de los A's es contra NAA4-Kumon Learning-Sheron el martes.</p>`,
    2: `<p>Los A's de 906 Grosskurth tuvieron dificultades para seguir el ritmo de NAA4-Kumon Learning-Sheron en una derrota de 12-3 el martes en Browns Road.</p>
<p>NAA4-Kumon Learning-Sheron tomó la ventaja en la parte baja de la primera entrada después de que el #23 fue golpeado por un lanzamiento, impulsando una carrera, el #6 recibió una base por bolas, anotando una carrera, y el #29 conectó un doble, anotando dos carreras.</p>
<p>NAA4-Kumon Learning-Sheron amplió su ventaja con cuatro carreras en la parte baja de la tercera gracias a bases por bolas impulsadoras del #23, #6, #29 y #5.</p>
<p>El #1 se llevó la victoria para NAA4-Kumon Learning-Sheron. El abridor permitió dos hits y tres carreras en cuatro entradas y dos tercios, ponchando a 10 y otorgando seis bases por bolas. Sean subió primero al montículo por los A's. El abridor permitió dos hits y cuatro carreras en dos tercios de entrada, ponchando a dos y otorgando tres bases por bolas.</p>
<p>Matthew y Christian conectaron un hit cada uno para los A's. Salvatore, Conor y Christian impulsaron una carrera cada uno. Los A's tuvieron paciencia en el plato, acumulando seis bases por bolas en el juego. CJ y Brogan lideraron al equipo con dos bases por bolas cada uno. CJ y Matthew robaron múltiples bases cada uno. Los A's robaron siete bases en el juego.</p>
<p>El #29 lideró a NAA4-Kumon Learning-Sheron con tres carreras impulsadas desde el octavo puesto de la alineación. El #29 fue de 1-para-1 en el día. El primer bateador #42 lideró a NAA4-Kumon Learning-Sheron con dos hits en tres turnos al bate. NAA4-Kumon Learning-Sheron tuvo paciencia en el plato, acumulando 13 bases por bolas en el juego. El #1, #6 y #5 lideraron al equipo con dos bases por bolas cada uno. El #28 robó dos bases.</p>
<p>Los A's juegan de locales el jueves contra NAA3-La Vida Massage-DeMato en su próximo juego.</p>`,
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

export function getRecapBody(gameNum) {
  if (currentLang !== 'en' && RECAP_TRANSLATIONS[currentLang] && RECAP_TRANSLATIONS[currentLang][gameNum]) {
    return RECAP_TRANSLATIONS[currentLang][gameNum];
  }
  return null;
}
