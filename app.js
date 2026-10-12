const API = 'https://raw.githubusercontent.com/AirwaveDB/api/main/v1';

const country = document.querySelector('#country');
const search = document.querySelector('#search');
const type = document.querySelector('#type');
const status = document.querySelector('#status');
const stationsEl = document.querySelector('#stations');
const summary = document.querySelector('#summary');
const template = document.querySelector('#station-template');

let current = [];
let countryNames;

try {
  countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  countryNames = null;
}

function countryName(code) {
  try { return countryNames?.of(code) || code; } catch { return code; }
}

function fmtStream(stream) {
  const parts = [];
  if (stream.codec) parts.push(stream.codec.toUpperCase());
  if (stream.bitrate) parts.push(`${stream.bitrate} kbps`);
  if (stream.hls) parts.push('HLS');
  return parts.join(' · ') || 'Stream';
}

function searchable(station) {
  return [
    station.name,
    station.country,
    station.subdivision,
    station.type,
    ...(station.languages || []),
    ...(station.categories || []),
    ...(station.tags || []),
  ].filter(Boolean).join(' ').toLocaleLowerCase();
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const wantedType = type.value;
  const filtered = current.filter((station) => {
    if (wantedType && station.type !== wantedType) return false;
    if (query && !searchable(station).includes(query)) return false;
    return true;
  });

  stationsEl.replaceChildren();
  const fragment = document.createDocumentFragment();

  for (const station of filtered) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector('.station-name').textContent = station.name;

    const typeEl = node.querySelector('.station-type');
    if (station.type) typeEl.textContent = station.type;
    else typeEl.remove();

    const meta = [];
    if (station.subdivision) meta.push(station.subdivision);
    if (station.languages?.length) meta.push(station.languages.join(', '));
    meta.push(`${station.streams?.length || 0} stream${station.streams?.length === 1 ? '' : 's'}`);
    node.querySelector('.station-meta').textContent = meta.join(' · ');

    const tags = node.querySelector('.station-tags');
    for (const value of [...(station.categories || []), ...(station.tags || []).slice(0, 5)]) {
      const span = document.createElement('span');
      span.textContent = value;
      tags.append(span);
    }

    const homepage = node.querySelector('.homepage');
    if (station.homepage) homepage.href = station.homepage;
    else homepage.remove();

    const select = node.querySelector('.stream-select');
    const player = node.querySelector('.player');
    const play = node.querySelector('.play');
    const streams = station.streams || [];

    if (!streams.length) {
      select.remove();
      play.disabled = true;
      play.textContent = 'No stream';
      player.remove();
    } else {
      streams.forEach((stream, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = fmtStream(stream);
        select.append(option);
      });
      play.addEventListener('click', async () => {
        const stream = streams[Number(select.value) || 0];
        if (!stream) return;
        if (player.src !== stream.url) player.src = stream.url;
        try {
          await player.play();
          play.textContent = 'Playing';
        } catch {
          play.textContent = 'Failed';
        }
      });
      player.addEventListener('pause', () => { if (!player.ended) play.textContent = 'Play'; });
    }

    fragment.append(node);
  }

  stationsEl.append(fragment);
  status.textContent = `${filtered.length.toLocaleString()} station${filtered.length === 1 ? '' : 's'}`;
}

async function loadCountry(code) {
  if (!code) {
    current = [];
    stationsEl.replaceChildren();
    status.textContent = '';
    search.disabled = true;
    type.disabled = true;
    return;
  }

  status.textContent = 'Loading…';
  stationsEl.replaceChildren();
  search.disabled = true;
  type.disabled = true;

  try {
    const response = await fetch(`${API}/countries/${code.toLowerCase()}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    current = data.stations || [];
    search.disabled = false;
    type.disabled = false;
    render();
  } catch (error) {
    current = [];
    status.textContent = `Failed to load ${code}: ${error.message}`;
  }
}

async function init() {
  try {
    const [indexRes, countriesRes] = await Promise.all([
      fetch(`${API}/index.json`),
      fetch(`${API}/countries.json`),
    ]);
    if (!indexRes.ok || !countriesRes.ok) throw new Error('API data is not available yet');
    const index = await indexRes.json();
    const countries = await countriesRes.json();

    summary.textContent = `${index.stationCount.toLocaleString()} stations · ${index.streamCount.toLocaleString()} streams · ${index.countryCount.toLocaleString()} country buckets`;

    for (const item of countries.sort((a, b) => countryName(a.code).localeCompare(countryName(b.code)))) {
      const option = document.createElement('option');
      option.value = item.code;
      option.textContent = `${countryName(item.code)} (${item.stationCount.toLocaleString()})`;
      country.append(option);
    }
    country.disabled = false;
  } catch (error) {
    summary.textContent = error.message;
  }
}

country.addEventListener('change', () => loadCountry(country.value));
search.addEventListener('input', render);
type.addEventListener('change', render);

init();
