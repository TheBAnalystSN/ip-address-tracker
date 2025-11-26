/* ============================================
   IP Address Tracker (Geolocation-DB version)
   No API key required
   ============================================ */

/* ========== DOM ELEMENTS ========== */
const inputEl = document.getElementById("search-input");
const btnEl = document.getElementById("search-btn");
const ipEl = document.getElementById("ip");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");

/* ========== MAP STATE ========== */
let map;
let markerLayer;

/* Custom map marker */
function createIcon() {
  return L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [23, 56]
  });
}

/* Setup map */
function initMap() {
  if (map) return;
  map = L.map("map", { zoomControl: true }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

/* Show marker on map */
function showMarker(lat, lng, popupText) {
  markerLayer.clearLayers();
  const icon = createIcon();
  const marker = L.marker([lat, lng], { icon }).addTo(markerLayer);

  if (popupText) {
    marker.bindPopup(popupText, { closeButton: false }).openPopup();
  }

  map.setView([lat, lng], 13);
}

/* Update UI info panel */
function updateInfoPanel(data, isp = "—") {
  ipEl.textContent = data.IPv4 || data.ip || "—";

  const city = data.city || "";
  const state = data.state || "";
  const country = data.country_name || "";

  locationEl.textContent = `${city}, ${state} ${country}`.trim() || "—";

  timezoneEl.textContent = data.time_zone || "—";
  ispEl.textContent = isp;
}

/* Convert domain → IP */
async function resolveDomain(domain) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}`);
    const json = await res.json();

    const answers = json.Answer;
    if (!answers || answers.length === 0) return null;

    const aRecord = answers.find(a => a.type === 1);
    return aRecord ? aRecord.data : null;

  } catch (err) {
    return null;
  }
}

/* Fetch geo info from geolocation-db */
async function fetchGeo(ip = "") {
  const url = ip
    ? `https://geolocation-db.com/json/${ip}&position=true`
    : `https://geolocation-db.com/json/&position=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geo lookup failed");

  return await res.json();
}

/* INITIAL LOAD */
async function initApp() {
  initMap();

  try {
    const data = await fetchGeo();
    updateInfoPanel(data);
    showMarker(data.latitude, data.longitude, data.city);

  } catch (err) {
    console.error("Init error:", err);
  }
}

/* SEARCH HANDLER */
async function handleSearch() {
  let query = inputEl.value.trim();
  if (!query) return alert("Enter an IP or domain.");

  let ip = query;

  // Domain? Convert to IP
  if (isNaN(query.replace(/\./g, ""))) {
    ip = await resolveDomain(query);
    if (!ip) return alert("Invalid domain. Could not resolve.");
  }

  try {
    const data = await fetchGeo(ip);
    updateInfoPanel(data);
    showMarker(data.latitude, data.longitude, data.city);

  } catch (err) {
    console.error("Search error:", err);
    alert("Unable to locate that IP or domain.");
  }
}

/* EVENTS */
btnEl.addEventListener("click", handleSearch);
inputEl.addEventListener("keypress", e => {
  if (e.key === "Enter") handleSearch();
});

/* START APP */
initApp();
