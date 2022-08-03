import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

let material = null;
let geometry = null;
let points = null;

const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5
parameters.branches = 3 
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPow = 3
parameters.insideColor = "#ff6030"
parameters.outsideColor = "#1b3984"

const generateGalaxy = () => {
  if (points !== null) {
    material.dispose();
    geometry.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry();
  const position = new Float32Array(parameters.count * 3);
  const colorPosition = new Float32Array(parameters.count*3)

  const colorinside = new THREE.Color(parameters.insideColor)
  const coloroutside = new THREE.Color(parameters.outsideColor) 
 
  for (let i = 0; i < parameters.count; i++) {
    let i3 = i * 3;
    const radius1 = Math.random()*parameters.radius
    const branchAngle = ((i%parameters.branches)/parameters.branches)*2*Math.PI
    const spinAngle = radius1*parameters.spin
    const randomX = Math.pow(Math.random(),parameters.randomnessPow)*(Math.random() < 0.5?1:-1)
    const randomY = Math.pow(Math.random(),parameters.randomnessPow)*(Math.random() < 0.5?1:-1)
    const randomZ = Math.pow(Math.random(),parameters.randomnessPow)*(Math.random() < 0.5?1:-1)

    position[i3 + 0] = Math.cos(branchAngle + spinAngle)*radius1 + randomX;
    position[i3 + 1] = 0 + randomY
    position[i3 + 2] = Math.sin(branchAngle + spinAngle)*radius1 + randomZ
    const mixedColor = colorinside.clone()
    mixedColor.lerp(coloroutside,radius1/parameters.radius)
    colorPosition[i3] = mixedColor.r
    colorPosition[i3+1] = mixedColor.g
    colorPosition[i3+2] = mixedColor.b
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colorPosition, 3));
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors:true
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

gui
  .add(parameters, "count")
  .min(100)
  .max(parameters.count + 10000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.01)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.add(parameters,'radius').min(1).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPow').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
