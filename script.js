/* ===============================
   IP ADDRESS TRACKER
   Uses ipapi.co (no API key needed)
================================ */

const inputEl = document.getElementById("search-input");
const btnEl = document.getElementById("search-btn");

const ipEl = document.getElementById("ip");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");

let map;
let marker;

/* Initialize Map */
function initMap() {
  map = L.map("map").setView([20, 0], 3);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  marker = L.marker([0, 0], {
    icon: L.icon({
      iconUrl: "images/icon-location.svg",
      iconSize: [46, 56],
      iconAnchor: [23, 56]
    })
  }).addTo(map);
}

/* Update UI panel */
function updatePanel(data) {
  ipEl.textContent = data.ip || "—";
  locationEl.textContent = `${data.city}, ${data.region}, ${data.country_name}`;
  timezoneEl.textContent = data.timezone;
  ispEl.textContent = data.org || "Unknown ISP";
}

/* Move marker */
function updateMap(lat, lng) {
  map.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);
}

/* Resolve domain → IP */
async function resolveDomain(domain) {
  try {
    const url = `https://dns.google/resolve?name=${domain}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.Answer) return null;

    const aRecord = json.Answer.find(a => a.type === 1);
    return aRecord ? aRecord.data : null;
  } catch (err) {
    return null;
  }
}

/* Fetch geo info (IP or domain) */
async function fetchGeo(query) {
  let targetIP = query;

  // If it's a domain, resolve it
  if (isNaN(query[0])) {
    const result = await resolveDomain(query);
    if (!result) throw new Error("Invalid domain");
    targetIP = result;
  }

  const res = await fetch(`https://ipapi.co/${targetIP}/json/`);
  const data = await res.json();

  if (data.error) throw new Error("Invalid IP");

  updatePanel(data);
  updateMap(data.latitude, data.longitude);
}

/* Load user's IP on startup */
async function loadUserIP() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();

  updatePanel(data);
  updateMap(data.latitude, data.longitude);
}

/* Event listeners */
btnEl.addEventListener("click", () => {
  const value = inputEl.value.trim();
  if (value) fetchGeo(value).catch(alert);
});

inputEl.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const value = inputEl.value.trim();
    if (value) fetchGeo(value).catch(alert);
  }
});

/* Initialize */
initMap();
loadUserIP();
