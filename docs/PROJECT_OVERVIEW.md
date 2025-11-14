# Three.js Globe Clone – Project Overview

## 1. Runtime Architecture
- **Entry point**: `index.js` selects the `#globe-container` element, instantiates `World`, and calls `world.start()` to begin the render loop.
- **World bootstrap**: `world/world.js` wires together the renderer, scene, camera, orbital controls, lighting, and the animated `Globe` component. It also positions the camera on Hong Kong at load time with `pointOfView()` and keeps all updatable actors (controls + globe) in the shared animation loop.
- **Systems vs. Components**:
  - `world/components/*`: stateless factories for scene graph objects (camera, lights, scene fog, globe).
  - `world/systems/*`: cross‑cutting helpers such as renderer setup, resize handling, orbit controls, animation loop, and utilities (color conversion, camera tweening, randomization).
  - Assets in `world/assets/` store the GeoJSON polygons (`globe-min.json`) and the custom arc definitions (`arcs-data.json`).

## 2. Key Modules
| Module | Responsibilities | Notable knobs |
| --- | --- | --- |
| `world/components/camera.js` | Creates a perspective camera locked between `near=180` and `far=1800` with radius `cameraZ=300`. | Edit `cameraZ` or the FOV to zoom the globe in/out (must match OrbitControls min/max distance). |
| `world/components/scene.js` | Adds global fog (`#535ef3`) for atmospheric depth. | Adjust color or range to change perceived haze. |
| `world/components/lights.js` | Configures ambient + directional lights and a point light for rim highlights. | Modify light colors/positions for different moods. |
| `world/components/globe.js` | Wraps `three-globe`, builds polygon, arc, and point data, and exposes a `.tick` hook for pulsing rings. | See Sections 3 and 4 below. |
| `world/systems/controls.js` | Creates `OrbitControls` with disabled pan/zoom and gentle auto-rotation. | Toggle `enableZoom` or adjust `autoRotateSpeed` for interactivity changes. |
| `world/systems/loop.js` | Central animation loop invoking `tick(delta)` on every registered updatable before rendering. | Push new objects into `loop.updatables` to animate them each frame. |
| `world/systems/utils.js` | Utility helpers: `hexToRgb`, random index generation, and the `pointOfView` tween helper used for camera flights. | Call `pointOfView` with `{lat, lng, altitude}` to move the camera smoothly to a region. |

## 3. Appearance Customization
1. **Globe body** (`_buildMaterial`): tweak `globeMaterial.color`, `emissive`, and `emissiveIntensity` for brand colors, or expose controls in UI to adjust them live.
2. **Atmosphere & polygons** (`initCountries`):
   - `hexPolygonResolution` controls polygon detail; higher values cost more GPU time.
   - `hexPolygonMargin` adds spacing between country cells.
   - Modify `.hexPolygonColor()` to base colors on feature properties (e.g., highlight selected countries).
3. **Fog and background**: update `scene.fog` color/distance and `renderer.setClearColor` to match Shopify theme backgrounds.
4. **Lighting**: Balance `DirectionalLight` intensities for dramatic vs. soft shading.
5. **Camera motion**: Use `pointOfView(camera, controls, globe.instance, { lat, lng, altitude }, duration)` to create scripted flyovers or respond to UI interactions.

## 4. Data & Animations
- **Arc and point data** live in `world/assets/arcs-data.json`. Each entry uses `{ startLat, startLng, endLat, endLng, arcAlt, color }` plus metadata like `from`, `to`, `order`. Update or generate this file from your own data source (e.g., Shopify order routes) and reload to see new connections.
- **Country polygons** come from `world/assets/globe-min.json` (GeoJSON). Replace with a higher resolution dataset if needed.
- **Animation settings** (`Globe`):
  - `ARC_REL_LEN`, `FLIGHT_TIME`, and `arcDash*` options control dash spacing and flight speed.
  - `NUM_RINGS`, `RING_PROPAGATION_SPEED`, and `interval` determine how many pulsating destination rings spawn and how often.
  - `_buildData()` deduplicates point markers derived from arcs; extend this method to add custom metadata (tooltips, click handlers via `three-globe`).

## 5. Development Workflow
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the dev server** (Vite defaults to `http://localhost:5173`)
   ```bash
   npx vite
   ```
3. **Entry HTML**: ensure your host page (e.g., Shopify section or standalone `index.html`) contains an element with `id="globe-container"` so the renderer can mount into it.
4. **Hot reload**: Vite automatically reloads on file edits. Globe assets (`*.json`) are plain ES module imports, so restarting isn’t necessary unless you change the data structure.

## 6. Extending the Project
- **Inject new updatables**: push objects with a `.tick(delta)` method into `loop.updatables` for synchronized animations.
- **Resize logic**: `Resizer` recalculates canvas dimensions on `window.resize`. If embedding in Shopify sections, adapt `canvasWidth`/`canvasHeight` in `world/systems/config.js` to respect container bounds or responsive breakpoints.
- **Packaging**: Because the entry is a plain script, you can either embed the built bundle in a Shopify theme asset or load it via an app block. Use Vite’s `build` command for production output.

