import ThreeGlobe from "three-globe";
import countries from "../assets/globe-min.json";
import arcsData from "../assets/arcs-data.json";
import { hexToRgb, genRandomNumbers } from "../systems/utils";
import { Color } from "three";

const defaultGlobeConfig = {
  arcRelativeLength: 0.9, // relative to whole arc
  flightTime: 2000,
  numRings: 1,
  ringMaxRadius: 3, // deg
  ringPropagationSpeed: 3, // deg/sec
  ringSpawnInterval: 2,
  hexPolygonResolution: 3,
  hexPolygonMargin: 0.7,
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.1,
  polygonColor: "rgba(255,255,255, 0.7)",
  pointAltitude: 0.0,
  pointRadius: 0.25,
};

class Globe {
  constructor(config = {}) {
    this.config = { ...defaultGlobeConfig, ...config };
    this.instance = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    });
    this.pointsData = [];
    this.currentColor = "#3b42ec";
    this.deltaGlobe = 0;
    this.numbersOfRings = 0;

    this._buildData();
    this._buildMaterial();

    this.instance.tick = (delta) => this.tick(delta);
  }

  init() {
    this.initCountries(1000);
    this.initAnimationData(1000);
  }

  initCountries(delay) {
    setTimeout(() => {
      this._applyCountryConfig();
    }, delay);
  }

  initAnimationData(delay) {
    setTimeout(() => {
      this._applyAnimationConfig();
    }, delay);
  }

  tick(delta) {
    this.deltaGlobe += delta;

    if (this.deltaGlobe > this.config.ringSpawnInterval) {
      this.numbersOfRings = genRandomNumbers(
        0,
        this.pointsData.length,
        Math.floor((this.pointsData.length * 4) / 5)
      );
      this.instance.ringsData(
        this.pointsData.filter((d, i) => this.numbersOfRings.includes(i))
      );

      this.deltaGlobe =
        this.deltaGlobe % this.config.ringSpawnInterval;
    }
  }

  _buildData() {
    const arcs = arcsData.flights;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color);
      points.push({
        size: 1.0,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        label: arc.from,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: 1.0,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        label: arc.to,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }
    this.pointsData = points.filter(
      (v, i, a) =>
        a.findIndex((v2) => ["lat", "lng"].every((k) => v2[k] === v[k])) === i
    );
  }

  _buildMaterial() {
    const globeMaterial = this.instance.globeMaterial();
    globeMaterial.color = new Color(this.currentColor);
    globeMaterial.emissive = new Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.9;
  }

  _applyCountryConfig() {
    const {
      hexPolygonResolution,
      hexPolygonMargin,
      showAtmosphere,
      atmosphereColor,
      atmosphereAltitude,
      polygonColor,
    } = this.config;

    const polygonColorFn =
      typeof polygonColor === "function"
        ? polygonColor
        : () => polygonColor;

    this.instance
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(hexPolygonResolution)
      .hexPolygonMargin(hexPolygonMargin)
      .showAtmosphere(showAtmosphere)
      .atmosphereColor(atmosphereColor)
      .atmosphereAltitude(atmosphereAltitude)
      .hexPolygonColor(polygonColorFn);
  }

  _applyAnimationConfig() {
    const {
      arcRelativeLength,
      flightTime,
      ringMaxRadius,
      ringPropagationSpeed,
      pointAltitude,
      pointRadius,
      numRings,
    } = this.config;

    const ringRepeatPeriod =
      numRings === 0
        ? Infinity
        : (flightTime * arcRelativeLength) / numRings;

    this.instance
      .arcsData(arcsData.flights)
      .arcStartLat((d) => d.startLat * 1)
      .arcStartLng((d) => d.startLng * 1)
      .arcEndLat((d) => d.endLat * 1)
      .arcEndLng((d) => d.endLng * 1)
      .arcColor((e) => e.color)
      .arcAltitude((e) => {
        return e.arcAlt * 1;
      })
      .arcStroke((e) => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcDashLength(arcRelativeLength)
      .arcDashInitialGap((e) => e.order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime((e) => flightTime)
      .pointsData(this.pointsData)
      .pointColor((e) => e.color)
      .pointsMerge(true)
      .pointAltitude(pointAltitude)
      .pointRadius(pointRadius)
      .ringsData([])
      .ringColor((e) => (t) => e.color(t))
      .ringMaxRadius(ringMaxRadius)
      .ringPropagationSpeed(ringPropagationSpeed)
      .ringRepeatPeriod(ringRepeatPeriod);
  }

  updateConfig(partialConfig = {}) {
    this.config = { ...this.config, ...partialConfig };
    this._applyCountryConfig();
    this._applyAnimationConfig();
  }

  setColor(hexColor) {
    if (!hexColor) {
      return;
    }

    const normalized = typeof hexColor === "string" ? hexColor : `#${hexColor}`;
    this.currentColor = normalized;
    const color = new Color(normalized);
    const globeMaterial = this.instance.globeMaterial();
    globeMaterial.color = color;

    const emissiveColor = color.clone();
    emissiveColor.offsetHSL(0, 0.1, -0.3);
    globeMaterial.emissive = emissiveColor;
  }
}

export { Globe };
