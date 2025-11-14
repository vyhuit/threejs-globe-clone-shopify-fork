import { MathUtils, Vector3 } from "three";
import { createCamera } from "./components/camera";
import { createRenderer } from "./systems/renderer";
import { createScene } from "./components/scene";
import { Loop } from "./systems/loop";
import { createControls } from "./systems/controls";
import { createLights } from "./components/lights";
import { Resizer } from "./systems/resizer";
import { Globe } from "./components/globe";
import { pointOfView } from "./systems/utils";
import { minZoomDistance, maxZoomDistance, zoomStep } from "./systems/config";

let camera;
let controls;
let renderer;
let scene;
let loop;
let globe;
const zoomVector = new Vector3();

class World {
  constructor(container) {
    this.container = container;
    renderer = createRenderer();
    scene = createScene();
    camera = createCamera();

    loop = new Loop(camera, scene, renderer);
    controls = createControls(camera, renderer.domElement);
    controls.update();
    loop.updatables.push(controls);

    const { ambientLight, dLight, dLight1, dLight2 } = createLights();
    camera.add(ambientLight, dLight, dLight1, dLight2);

    globe = new Globe();
    globe.init();
    loop.updatables.push(globe.instance);

    scene.add(camera, globe.instance);

    pointOfView(
      camera,
      controls,
      globe.instance,
      { lat: 22.3193, lng: 114.1694 },
      1000
    ); // China HongKong

    const resizer = new Resizer(camera, renderer);

    container.append(renderer.domElement);
    this.initZoomButtons();
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

  initZoomButtons() {
    if (!this.container) {
      return;
    }

    const zoomButtons = this.container.querySelectorAll("[data-zoom-direction]");

    zoomButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.getAttribute("data-zoom-direction");
        const delta = direction === "in" ? -zoomStep : zoomStep;
        this.updateZoom(delta);
      });
    });
  }

  updateZoom(delta) {
    if (!camera || !controls) {
      return;
    }

    const currentDistance = camera.position.distanceTo(controls.target);
    const nextDistance = MathUtils.clamp(
      currentDistance + delta,
      minZoomDistance,
      maxZoomDistance
    );

    zoomVector
      .copy(camera.position)
      .sub(controls.target)
      .normalize()
      .multiplyScalar(nextDistance)
      .add(controls.target);

    camera.position.copy(zoomVector);
    controls.update();
  }
}

export { World };
