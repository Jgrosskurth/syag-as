import { t, getLang, toggleLang } from '../../scripts/i18n.js';

const WEATHER_LAT = 40.79;
const WEATHER_LON = -73.08;
const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York`;

const WMO_CONDITIONS = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mostly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅', cloudy: true },
  3: { label: 'Overcast', icon: '☁️', cloudy: true },
  45: { label: 'Foggy', icon: '🌫️', cloudy: true },
  48: { label: 'Icy Fog', icon: '🌫️', cloudy: true },
  51: { label: 'Light Drizzle', icon: '🌦️', rain: true },
  53: { label: 'Drizzle', icon: '🌦️', rain: true },
  55: { label: 'Heavy Drizzle', icon: '🌧️', rain: true },
  61: { label: 'Light Rain', icon: '🌦️', rain: true },
  63: { label: 'Rain', icon: '🌧️', rain: true },
  65: { label: 'Heavy Rain', icon: '🌧️', rain: true },
  66: { label: 'Freezing Rain', icon: '🌧️', rain: true },
  67: { label: 'Heavy Freezing Rain', icon: '🌧️', rain: true },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  77: { label: 'Snow Grains', icon: '❄️' },
  80: { label: 'Light Showers', icon: '🌦️', rain: true },
  81: { label: 'Showers', icon: '🌧️', rain: true },
  82: { label: 'Heavy Showers', icon: '🌧️', rain: true },
  85: { label: 'Snow Showers', icon: '🌨️' },
  86: { label: 'Heavy Snow Showers', icon: '❄️' },
  95: { label: 'Thunderstorm', icon: '⛈️', rain: true },
  96: { label: 'Thunderstorm w/ Hail', icon: '⛈️', rain: true },
  99: { label: 'Severe Thunderstorm', icon: '⛈️', rain: true },
};

async function fetchWeather() {
  try {
    const resp = await fetch(WEATHER_API);
    if (!resp.ok) return null;
    const data = await resp.json();
    const c = data.current;
    const code = c.weather_code;
    const info = WMO_CONDITIONS[code] || { label: 'Unknown', icon: '🌡️' };
    return {
      temp: Math.round(c.temperature_2m),
      wind: Math.round(c.wind_speed_10m),
      label: info.label,
      icon: info.icon,
      isRain: !!info.rain,
      isCloudy: !!info.cloudy || !!info.rain,
    };
  } catch { return null; }
}

function createRaindrops() {
  if (document.getElementById('rain-container')) return;
  const container = document.createElement('div');
  container.id = 'rain-container';
  container.setAttribute('aria-hidden', 'true');
  const dropCount = window.innerWidth < 640 ? 30 : 60;
  for (let i = 0; i < dropCount; i += 1) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    drop.style.animationDuration = `${0.6 + Math.random() * 0.6}s`;
    drop.style.opacity = `${0.2 + Math.random() * 0.5}`;
    container.append(drop);
  }
  document.body.append(container);
}

function createClouds() {
  if (document.getElementById('cloud-container')) return;
  const container = document.createElement('div');
  container.id = 'cloud-container';
  container.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 6; i += 1) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = `${8 + Math.random() * 60}%`;
    cloud.style.animationDuration = `${30 + Math.random() * 40}s`;
    cloud.style.animationDelay = `${-Math.random() * 40}s`;
    cloud.style.opacity = `${0.04 + Math.random() * 0.06}`;
    cloud.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    container.append(cloud);
  }
  document.body.append(container);
}

function computeRecord() {
  const schedule = document.querySelector('.schedule');
  if (!schedule) return null;
  let win = 0;
  let loss = 0;
  let tie = 0;
  schedule.querySelectorAll('.sched-result').forEach((el) => {
    const text = el.textContent.trim();
    if (text.startsWith('W')) win += 1;
    else if (text.startsWith('L')) loss += 1;
    else if (text.startsWith('T')) tie += 1;
  });
  if (win === 0 && loss === 0 && tie === 0) return null;
  return tie > 0 ? `${win} - ${loss} - ${tie}` : `${win} - ${loss}`;
}

function buildNav(weather) {
  const weatherHTML = weather
    ? `<div class="weather-widget">
        <span class="weather-icon">${weather.icon}</span>
        <span class="weather-temp">${weather.temp}°F</span>
        <span class="weather-label">${weather.label}</span>
        <span class="weather-wind">${weather.wind} mph</span>
      </div>`
    : '<div class="weather-widget weather-loading">Loading...</div>';

  return `
    ${weatherHTML}
    <div class="header-top">
      <div class="team-logo">A's</div>
      <div class="team-info">
        <div class="team-name">${t('teamName')}</div>
        <div class="team-subtitle">${t('teamSubtitle')}</div>
        <div class="team-record"></div>
      </div>
      <button class="lang-toggle" aria-label="Toggle language">
        ${getLang() === 'en' ? 'ES' : 'EN'}
      </button>
    </div>
    <div class="nav-tabs">
      <a href="#roster" class="nav-tab active">${t('roster')}</a>
      <a href="#schedule" class="nav-tab">${t('schedule')}</a>
      <a href="#stats" class="nav-tab">${t('stats')}</a>
      <a href="#livestream" class="nav-tab">${t('live')}</a>
      <a href="#recaps" class="nav-tab">${t('recaps')}</a>
      <a href="#resources" class="nav-tab">${t('resources')}</a>
    </div>
  `;
}

export default async function decorate(block) {
  block.textContent = '';

  let weather = null;
  const nav = document.createElement('nav');
  nav.innerHTML = buildNav(weather);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);

  function rebind() {
    wrapper.querySelector('.lang-toggle')?.addEventListener('click', () => toggleLang());
    attachTabHandlers();
    updateRecord();
  }

  function refresh() {
    nav.innerHTML = buildNav(weather);
    rebind();
  }

  // Fetch weather
  fetchWeather().then((w) => {
    if (w) {
      weather = w;
      refresh();
      if (w.isRain) createRaindrops();
      if (w.isCloudy) createClouds();
    }
  });

  document.addEventListener('lang-change', () => refresh());

  const updateRecord = () => {
    const recordEl = wrapper.querySelector('.team-record');
    if (!recordEl) return;
    const record = computeRecord();
    if (record) recordEl.textContent = record;
  };

  let attempts = 0;
  const check = setInterval(() => {
    updateRecord();
    attempts += 1;
    if ((wrapper.querySelector('.team-record')?.textContent) || attempts > 20) clearInterval(check);
  }, 500);

  function attachTabHandlers() {
    wrapper.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.querySelectorAll('.nav-tab').forEach((tt) => tt.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  rebind();
}
