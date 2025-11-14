const aspect = 1.2;
const cameraZ = 300;
const canvasWidth = () => window.innerWidth / 1.8;
const canvasHeight = () => canvasWidth() / aspect;
const minZoomDistance = 220;
const maxZoomDistance = 420;
const zoomStep = 30;

export {
  aspect,
  cameraZ,
  canvasWidth,
  canvasHeight,
  minZoomDistance,
  maxZoomDistance,
  zoomStep,
};
