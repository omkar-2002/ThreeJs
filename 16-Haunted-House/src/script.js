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

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const alphaColorTexture = textureLoader.load("/textures/door/alpha.jpg");
const ambientOcclusionColorTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessColorTexture = textureLoader.load(
  "/textures/door/metalness.jpg"
);
const normalColorTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessColorTexture = textureLoader.load(
  "/textures/door/roughness.jpg"
);
const heightColorTexture = textureLoader.load("/textures/door/height.jpg");

// Wall textures

const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
const wallambientTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);

// Plane Textures

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);
const grassambientTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
//This is to repeat the texture so it doesnt stretch
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
grassambientTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassambientTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
grassambientTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Temporary sphere
const house = new THREE.Group();
scene.add(house);

//Walls
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 3, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallambientTexture,
    roughnessMap: wallRoughnessTexture,
    normalMap: wallNormalTexture,
  })
);
wall.position.y = 3 / 2;
house.add(wall);
wall.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
);
wall.castShadow = true

//Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(4, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x8e3200 })
);
roof.position.y = 3.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

//Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: alphaColorTexture,
    aoMap: ambientOcclusionColorTexture,
    displacementMap: heightColorTexture,
    displacementScale: 0.1,
    normalMap: normalColorTexture,
    metalnessMap: metalnessColorTexture,
    roughnessMap: roughnessColorTexture,
  })
);
// This setting is to enable ambient effect
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(door);

//Bushes

const bush1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#89c854" })
);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
house.add(bush1);
bush1.castShadow = true

const bush2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#89c854" })
);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.2, 2.1);
house.add(bush2);
bush2.castShadow = true

const bush3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#89c854" })
);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1.2, 0.2, 2.3);
house.add(bush3);
bush3.castShadow = true

const bush4 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#89c854" })
);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1.5, 0.1, 2.7);
house.add(bush4);
bush4.castShadow = true


//Grave
const graveGroup = new THREE.Group();

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.8, 0.25),
    new THREE.MeshStandardMaterial({ color: "grey" })
  );
  grave.position.y = 0.4;
  const angle = Math.random() * 2 * Math.PI;
  const radius = 3.5 + Math.random() * 6;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;

  grave.rotation.y = (Math.random() - 0.5) * 0.3;
  grave.rotation.z = (Math.random() - 0.5) * 0.15;
  grave.castShadow = true
  graveGroup.add(grave);
}
scene.add(graveGroup);

//Ghosts

const Ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(Ghost1);
const Ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(Ghost2);
const Ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(Ghost3);

// Floor
const floor = new THREE.Mesh(
  new THREE.BoxBufferGeometry(20, 20,0.2),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassambientTexture,
    roughnessMap: grassRoughnessTexture,
    normalMap: grassNormalTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Point Light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
house.add(doorLight);
doorLight.position.set(0, 2.2, 2.7);

//Fog

const fog = new THREE.Fog("#262837", 2, 15);
scene.fog = fog;


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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
//To give a clear fog look
renderer.setClearColor("#262837");

//Shadows

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
moonLight.castShadow = true
doorLight.castShadow = true
Ghost1.castShadow = true
Ghost2.castShadow = true
Ghost3.castShadow = true
floor.receiveShadow = true

Ghost1.shadow.mapSize.width = 256
Ghost1.shadow.mapSize.height = 256
Ghost1.shadow.camera.far = 7

Ghost2.shadow.mapSize.width = 256
Ghost2.shadow.mapSize.height = 256
Ghost2.shadow.camera.far = 7

Ghost3.shadow.mapSize.width = 256
Ghost3.shadow.mapSize.height = 256
Ghost3.shadow.camera.far = 7

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const angle = elapsedTime;
  Ghost1.position.x = Math.cos(angle) * 4;
  Ghost1.position.z = Math.sin(angle) * 4;
  Ghost1.position.y = Math.sin(angle * 3);

  const angle2 = -elapsedTime * 0.32;
  Ghost2.position.x = Math.cos(angle2) * 6;
  Ghost2.position.z = Math.sin(angle2) * 6;
  Ghost2.position.y = Math.sin(angle2 * 3) + Math.sin(angle2 * 4);

  const angle3 = -elapsedTime * 0.18;
  Ghost3.position.x = Math.cos(angle3) * (7 + Math.sin(elapsedTime * 0.32));
  Ghost3.position.z = Math.sin(angle3) * (7 + Math.sin(elapsedTime * 0.5));
  Ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);



  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
