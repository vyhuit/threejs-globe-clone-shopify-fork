import { PerspectiveCamera } from "three";
import { aspect, cameraZ } from "../systems/config";

function createCamera() {
  const fov = 50;
  // Allow the camera to move much closer to the globe so zooming in
  // doesn't clip the mesh (the OrbitControls min distance already keeps
  // us at a safe range, so we can use a small near plane value).
  const near = 1;
  const far = 1800;

  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, cameraZ);

  return camera;
}

export { createCamera };
