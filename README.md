# IP Address Tracker  

A responsive web application built with **HTML, CSS, and JavaScript** that allows users to look up the geographical location of any valid IP address or domain. The project uses **IPAPI** for live geolocation and **Leaflet.js** for dynamic map rendering.

This project was created as part of the Frontend Mentor challenge and the HTML/CSS/JS cumulative assessment.

---

## Features

- Automatically detects and displays **your current IP address** on page load.
- Search for **any IP address or domain**.
- Displays:
  - IP Address
  - City, Region, Country
  - Timezone
  - ISP / Organization
- Interactive map powered by **Leaflet.js**.
- Fully responsive (Desktop + Mobile).
- Clean and modern UI based on the project's design assets.

---

## Project Structure

IP-Address-Tracker/
  > images
  favicon-32x32.png
  icon-arrow.svg
  icon-location.svg
  pattern-bg-desktop.png
  pattern-bg-mobile.png
  > leaflet/dist
  >images
  layers-2x.png
  layers.png
  marker-icon-2x.png
  marker-icon.png
  marker-shadow.png
  js leaflet-src.esm.js
  js leaflet-src.esm.js.map
  js leaflet-src.js
  js leaflet-src.js.map
  #leaflet.css
  js leaflet.js
  leaflet.js.map
  .gitignore
  <> index.html
  README.md
  Reflection.md
  Screenshot 2025-11-27 114103.png
  Screenshot 2025-11-27 160349.png
  js script.js
  #style.css

---

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript**
- **Leaflet.js**
- **OpenStreetMap**
- **IPAPI (no key required)**

---

## Installation & Setup

### Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ip-address-tracker.git

# Open the projectt folder

cd ip-address-tracker

# Open in your browser

Double-click index.html or use the VS COde Live Server.

Geolocation

The app attempts:

* Exact IP search via IPAPI

* Domain → IP lookup (using Google DNS)

* Displays the results in the UI

* Moves the map to the correct location

Mapping

Leaflet initializes a map centered on the queried IP and displays a custom marker.

---

### Issues Solved During Development

* CORS errors from external APIs

* API endpoints that blocked local requests

* Incorrect or missing ISP / timezone data

* Image paths not loading due to folder structure

* Tracking Prevention blocking external resources (Microsoft Edge issue)

* Handling multiple response formats from different APIs

All issues were resolved by standardizing JSON parsing, switching to a stable API, normalizing data, and correcting the images folder structure.

---

### Deployment

You can deploy this static site to GitHub Pages:

1. Push your repo to GitHub
2. Go to:

Settings → Pages → Deploy from "root"

3. Save

Your site will be live at:

https://your-username.github.io/ip-address-tracker/

---

### Screenshots

Desktop UI

![Desktop](<Screenshot 2025-11-27 114103.png>)

Mobile UI

![Mobile](<Screenshot 2025-11-27 160349.png>)