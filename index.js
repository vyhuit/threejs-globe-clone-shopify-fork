import { World } from "./world/world";

const defaultSettings = {
  color: "#3b42ec",
  lat: 22.3193,
  lng: 114.1694,
  altitude: 1000,
  mission: "Orbital overview",
};

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

    state.color = color;
    if (!Number.isNaN(lat)) state.lat = lat;
    if (!Number.isNaN(lng)) state.lng = lng;
    if (!Number.isNaN(altitude)) state.altitude = altitude;
    state.mission = mission;

    world.setGlobeColor(state.color);
    world.setPointOfView({
      lat: state.lat,
      lng: state.lng,
      altitude: state.altitude,
    });
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

    if (colorInput) colorInput.value = state.color;
    if (latInput) latInput.value = state.lat;
    if (lngInput) lngInput.value = state.lng;
    if (altitudeInput) altitudeInput.value = state.altitude;
    if (missionInput) missionInput.value = state.mission;
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
}

main();
