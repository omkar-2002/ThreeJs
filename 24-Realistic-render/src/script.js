import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//gui intensity
const datguiIntensity = {};
datguiIntensity.envMapIntensity = 3;

/**
 * Update all Materials
 */

const updateAllMaterials = () => {
  scene.traverse((child) => {
    //check if the object is an instance of the Mesh class or MeshStandardMaterial then only update its map
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //   child.material.envMap = environmentMap;
      child.material.envMapIntensity = datguiIntensity.envMapIntensity;
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  });
};

/**
 * GLTFLoader
 */
// const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMap = cubeTextureLoader
  .setPath("/textures/environmentMaps")
  .load([
    "/0/px.jpg",
    "/0/nx.jpg",
    "/0/py.jpg",
    "/0/ny.jpg",
    "/0/pz.jpg",
    "/0/nz.jpg",
  ]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
// We can directlty apply envMap on objects through this no need of the updateforAll function
scene.environment = environmentMap;

/**
 * Models
 */

gltfLoader.load("/models/hamburgercopy.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.position.set(0, -1, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotationY");
  //Calling the function to add envMap on objects
  updateAllMaterials();
});

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// );
// scene.add(testSphere);

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, "intensity").min(-5).max(5).name("lightIntensity");
gui.add(directionalLight.position, "x").min(-5).max(5).name("posX");
gui.add(directionalLight.position, "y").min(-5).max(5).name("posY");
gui.add(directionalLight.position, "z").min(-5).max(5).name("posZ");
gui
  .add(datguiIntensity, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //To hide the stair effect
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
//Its about the grey scale of env colors
renderer.outputEncoding = THREE.sRGBEncoding;
//Its like filters
renderer.toneMapping = THREE.ReinhardToneMapping;
//Its about intensity of env light
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACLESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    (renderer.toneMapping = Number(renderer.toneMapping))
    updateAllMaterials()
  });
gui.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
