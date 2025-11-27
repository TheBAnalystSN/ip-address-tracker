/* IP Address Tracker — ipwho.is version
   - ipwho.is provides ip, city, region, country, latitude, longitude, timezone, and connection info
   - Domain resolution: dns.google
   - Works without API key and with typical browser security
*/

const inputEl = document.getElementById("search-input");
const btnEl = document.getElementById("search-btn");
const ipEl = document.getElementById("ip");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");

let map;
let markerLayer;
let marker;

// safe 
function safeSet(el, text) {
  if (!el) return;
  el.textContent = text ?? "—";
}

/* Create custom marker */
function createIcon() {
  return L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [46, 56],
    iconAnchor: [23, 56]
  });
}

/* Initialize Leaflet map */
function initMap() {
  if (map) return;
  map = L.map("map", { zoomControl: true }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
  marker = L.marker([0, 0], { icon: createIcon() }).addTo(markerLayer);
}

/* Move marker and center view */
function updateMap(lat, lng, label) {
  if (!map) initMap();
  if (lat == null || lng == null || Number.isNaN(+lat) || Number.isNaN(+lng)) {
    console.warn("Invalid coordinates", lat, lng);
    return;
  }
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 13);
  if (label) marker.bindPopup(label, { closeButton: false }).openPopup();
}

/* Domain -> IP resolver */
async function resolveDomain(domain) {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.Answer) return null;
    const a = json.Answer.find(a => a.type === 1);
    return a ? a.data : null;
  } catch (err) {
    console.warn("resolveDomain error", err);
    return null;
  }
}

/* Fetch from ipwho.is. Pass empty */
async function fetchIpWho(ipOrEmpty = "") {
  try {
    const url = ipOrEmpty ? `https://ipwho.is/${encodeURIComponent(ipOrEmpty)}` : `https://ipwho.is/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("ipwho.is returned non-OK: " + res.status);
    const json = await res.json();
    if (!json.success && json.success !== undefined) {
      // ipwho.is returns {success: false, message: "..."} on failure
      throw new Error("ipwho.is failure: " + (json.message || JSON.stringify(json)));
    }
    return json;
  } catch (err) {
    console.error("fetchIpWho error", err);
    throw err;
  }
}

/* search by IP or domain */
async function doLookup(query = "") {
  try {
    safeSet(ipEl, "Loading…");
    safeSet(locationEl, "Loading…");
    safeSet(timezoneEl, "Loading…");
    safeSet(ispEl, "Loading…");

    let target = query.trim();

    // detect domain pattern
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (target && domainRegex.test(target) && !/^\d/.test(target)) {
      const resolved = await resolveDomain(target);
      if (!resolved) throw new Error("Domain resolution failed");
      target = resolved;
    }

    // If empty, ipwho.is auto-detects client IP
    const data = await fetchIpWho(target || "");

    // Normalize fields
    const ip = data.ip || data.IPv4 || "";
    const lat = data.latitude ?? data.lat ?? null;
    const lng = data.longitude ?? data.lon ?? data.lng ?? null;
    const city = data.city || "";
    const region = data.region || data.region_code || data.region_name || "";
    const country = data.country || data.country_name || "";
    // timezone
    const tz = (data.timezone && (data.timezone.id || data.timezone)) || data.timezone || "";
    // ISP: ipwho.is returns connection?
    const isp = (data.connection && (data.connection.isp || data.connection.organization)) || data.org || data.isp || "";

    safeSet(ipEl, ip || "—");
    const locParts = [city, region, country].filter(Boolean);
    safeSet(locationEl, locParts.length ? locParts.join(", ") : "—");
    safeSet(timezoneEl, tz || "—");
    safeSet(ispEl, isp || "—");

    if (lat != null && lng != null) {
      updateMap(lat, lng, city || ip);
    } else {
      console.warn("No coordinates returned", data);
    }

  } catch (err) {
    console.error("doLookup error", err);
    safeSet(ipEl, "—");
    safeSet(locationEl, "—");
    safeSet(timezoneEl, "—");
    safeSet(ispEl, "—");
    alert("Could not fetch location. Check console for details.");
  }
}

/* Event handlers */
document.getElementById("search-btn").addEventListener("click", () => {
  const q = inputEl.value.trim();
  if (!q) { alert("Enter an IP or domain"); return; }
  doLookup(q);
});

inputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const q = inputEl.value.trim();
    if (!q) { alert("Enter an IP or domain"); return; }
    doLookup(q);
  }
});

/* Start app */
initMap();
doLookup(""); // auto-detect visitor IP
