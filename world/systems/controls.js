import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cameraZ, minZoomDistance, maxZoomDistance } from "./config";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = minZoomDistance;
  controls.maxDistance = maxZoomDistance;
  controls.zoomSpeed = 0.8;
  controls.autoRotateSpeed = 0.5;
  controls.autoRotate = true;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
