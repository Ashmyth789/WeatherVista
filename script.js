const tempEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const locationEl = document.getElementById('location');
const networkStatusEl = document.getElementById('networkStatus');
const lastUpdatedEl = document.getElementById('lastUpdated');
const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');

function checkNetworkStatus() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && conn.effectiveType) {
    if (conn.effectiveType.includes("2g") || conn.downlink < 1) {
      networkStatusEl.textContent = "⚠️ Low network - animations disabled";
      return false;
    }
  }
  networkStatusEl.textContent = "✅ Good network connection";
  return true;
}

function drawSunny() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FDB813";
  ctx.beginPath();
  ctx.arc(150, 100, 40, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloudy() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#bbb";
  ctx.beginPath();
  ctx.arc(120, 100, 30, 0, Math.PI * 2);
  ctx.arc(150, 90, 40, 0, Math.PI * 2);
  ctx.arc(180, 100, 30, 0, Math.PI * 2);
  ctx.fill();
}

function drawRainy() {
  drawCloudy();
  ctx.strokeStyle = "#00f";
  for (let i = 0; i < 10; i++) {
    let x = 110 + i * 15;
    ctx.beginPath();
    ctx.moveTo(x, 130);
    ctx.lineTo(x - 3, 145);
    ctx.stroke();
  }
}

function simulateWeather(lat, lon) {
  // Fake weather zones based on coordinates
  if (lat > 25 && lat < 28) return "Rainy";
  if (lat > 18 && lat <= 25) return "Cloudy";
  return "Sunny";
}

function displayWeather(condition) {
  conditionEl.textContent = condition;
  tempEl.textContent = "28.0°C";
  humidityEl.textContent = "Humidity: 64%";
  lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

  if (checkNetworkStatus()) {
    if (condition === "Rainy") drawRainy();
    else if (condition === "Cloudy") drawCloudy();
    else drawSunny();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function getLocationAndWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationEl.textContent = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
        const condition = simulateWeather(latitude, longitude);
        displayWeather(condition);
      },
      () => {
        locationEl.textContent = "Unable to get location.";
        tempEl.textContent = "--°C";
      }
    );
  } else {
    locationEl.textContent = "Geolocation not supported.";
  }
}

getLocationAndWeather();
