import { World } from "./world/world";

const defaultSettings = {
  color: "#3b42ec",
  lat: 22.3193,
  lng: 114.1694,
  altitude: 1000,
  mission: "Orbital overview",
  arcRelativeLength: 0.9,
  flightTime: 2000,
  ringSpawnInterval: 2,
  numRings: 1,
  ringMaxRadius: 3,
  ringPropagationSpeed: 3,
  pointAltitude: 0.0,
  pointRadius: 0.25,
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
};

const globeConfigKeys = [
  "arcRelativeLength",
  "flightTime",
  "ringSpawnInterval",
  "numRings",
  "ringMaxRadius",
  "ringPropagationSpeed",
  "pointAltitude",
  "pointRadius",
  "showAtmosphere",
  "atmosphereColor",
  "atmosphereAltitude",
];

function main() {
  const container = document.querySelector("#globe-container");
  const world = new World(container);
  world.start();
  setupSettingsUI(world);
}

function setupSettingsUI(world) {
  const modal = document.querySelector("[data-settings-modal]");
  const form = document.querySelector("[data-settings-form]");
  const openBtn = document.querySelector("[data-open-settings]");
  const closeBtns = document.querySelectorAll("[data-close-settings]");
  const hudPosition = document.querySelector("[data-hud-position]");
  const hudMission = document.querySelector("[data-hud-mission]");
  const hudSwatch = document.querySelector("[data-hud-swatch]");

  if (!modal || !form || !openBtn) {
    return;
  }

  const state = { ...defaultSettings };
  updateHud();
  applyWorldSettings();

  openBtn.addEventListener("click", () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    setFormValues();
  });

  closeBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      closeModal();
    })
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const color = formData.get("color")?.toString() || state.color;
    const lat = parseFloat(formData.get("lat"));
    const lng = parseFloat(formData.get("lng"));
    const altitude = parseFloat(formData.get("altitude"));
    const mission = formData.get("mission")?.toString().trim() || state.mission;
    const arcRelativeLength = parseFloat(formData.get("arcRelativeLength"));
    const flightTime = parseFloat(formData.get("flightTime"));
    const ringSpawnInterval = parseFloat(formData.get("ringSpawnInterval"));
    const numRings = parseInt(formData.get("numRings"), 10);
    const ringMaxRadius = parseFloat(formData.get("ringMaxRadius"));
    const ringPropagationSpeed = parseFloat(
      formData.get("ringPropagationSpeed")
    );
    const pointAltitude = parseFloat(formData.get("pointAltitude"));
    const pointRadius = parseFloat(formData.get("pointRadius"));
    const showAtmosphere = formData.get("showAtmosphere") !== "false";
    const atmosphereColor =
      formData.get("atmosphereColor")?.toString() || state.atmosphereColor;
    const atmosphereAltitude = parseFloat(
      formData.get("atmosphereAltitude")
    );

    state.color = color;
    if (!Number.isNaN(lat)) state.lat = lat;
    if (!Number.isNaN(lng)) state.lng = lng;
    if (!Number.isNaN(altitude)) state.altitude = altitude;
    state.mission = mission;
    if (!Number.isNaN(arcRelativeLength)) state.arcRelativeLength = arcRelativeLength;
    if (!Number.isNaN(flightTime)) state.flightTime = flightTime;
    if (!Number.isNaN(ringSpawnInterval))
      state.ringSpawnInterval = ringSpawnInterval;
    if (!Number.isNaN(numRings)) state.numRings = numRings;
    if (!Number.isNaN(ringMaxRadius)) state.ringMaxRadius = ringMaxRadius;
    if (!Number.isNaN(ringPropagationSpeed))
      state.ringPropagationSpeed = ringPropagationSpeed;
    if (!Number.isNaN(pointAltitude)) state.pointAltitude = pointAltitude;
    if (!Number.isNaN(pointRadius)) state.pointRadius = pointRadius;
    state.showAtmosphere = showAtmosphere;
    state.atmosphereColor = atmosphereColor;
    if (!Number.isNaN(atmosphereAltitude))
      state.atmosphereAltitude = atmosphereAltitude;

    applyWorldSettings();
    updateHud();
    closeModal();
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function setFormValues() {
    const colorInput = form.querySelector("[name='color']");
    const latInput = form.querySelector("[name='lat']");
    const lngInput = form.querySelector("[name='lng']");
    const altitudeInput = form.querySelector("[name='altitude']");
    const missionInput = form.querySelector("[name='mission']");
    const arcRelativeLengthInput = form.querySelector(
      "[name='arcRelativeLength']"
    );
    const flightTimeInput = form.querySelector("[name='flightTime']");
    const ringSpawnIntervalInput = form.querySelector(
      "[name='ringSpawnInterval']"
    );
    const numRingsInput = form.querySelector("[name='numRings']");
    const ringMaxRadiusInput = form.querySelector("[name='ringMaxRadius']");
    const ringPropagationSpeedInput = form.querySelector(
      "[name='ringPropagationSpeed']"
    );
    const pointAltitudeInput = form.querySelector("[name='pointAltitude']");
    const pointRadiusInput = form.querySelector("[name='pointRadius']");
    const showAtmosphereInput = form.querySelector("[name='showAtmosphere']");
    const atmosphereColorInput = form.querySelector("[name='atmosphereColor']");
    const atmosphereAltitudeInput = form.querySelector(
      "[name='atmosphereAltitude']"
    );

    if (colorInput) colorInput.value = state.color;
    if (latInput) latInput.value = state.lat;
    if (lngInput) lngInput.value = state.lng;
    if (altitudeInput) altitudeInput.value = state.altitude;
    if (missionInput) missionInput.value = state.mission;
    if (arcRelativeLengthInput) arcRelativeLengthInput.value = state.arcRelativeLength;
    if (flightTimeInput) flightTimeInput.value = state.flightTime;
    if (ringSpawnIntervalInput)
      ringSpawnIntervalInput.value = state.ringSpawnInterval;
    if (numRingsInput) numRingsInput.value = state.numRings;
    if (ringMaxRadiusInput) ringMaxRadiusInput.value = state.ringMaxRadius;
    if (ringPropagationSpeedInput)
      ringPropagationSpeedInput.value = state.ringPropagationSpeed;
    if (pointAltitudeInput) pointAltitudeInput.value = state.pointAltitude;
    if (pointRadiusInput) pointRadiusInput.value = state.pointRadius;
    if (showAtmosphereInput)
      showAtmosphereInput.value = state.showAtmosphere ? "true" : "false";
    if (atmosphereColorInput) atmosphereColorInput.value = state.atmosphereColor;
    if (atmosphereAltitudeInput)
      atmosphereAltitudeInput.value = state.atmosphereAltitude;
  }

  function updateHud() {
    if (hudPosition) {
      hudPosition.textContent = `Lat ${state.lat.toFixed(2)}°, Lng ${state.lng.toFixed(
        2
      )}°, Alt ${Math.round(state.altitude)} km`;
    }
    if (hudMission) {
      hudMission.textContent = state.mission;
    }
    if (hudSwatch) {
      hudSwatch.style.setProperty("background", state.color);
    }
  }

  function applyWorldSettings() {
    world.setGlobeColor(state.color);
    world.setPointOfView({
      lat: state.lat,
      lng: state.lng,
      altitude: state.altitude,
    });
    world.updateGlobeConfig(getGlobeConfig());
  }

  function getGlobeConfig() {
    return globeConfigKeys.reduce((config, key) => {
      config[key] = state[key];
      return config;
    }, {});
  }
}

main();
