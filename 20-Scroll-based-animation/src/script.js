import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import gsap from "gsap";
/**
 * Debug
 */
const gui = new dat.GUI();



/*
Textures
*/

const textureLoader = new THREE.TextureLoader();

const matCapTexture = textureLoader.load('textures/matcaps/10.jpg')

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter; // This is to add the toon effect but we added it right? yes but \
//due to linear gradient it is evenly spread this effect does the round off of the linear gradient and we get precise colors



const parameters = {
  materialColor: "#ffeded",
};

const objectDistance = 4;

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Geometries
 *
 * */

//Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

scene.add(mesh1, mesh2, mesh3);

mesh1.position.y = -objectDistance * 0;
mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const sectionMeshes = [mesh1, mesh2, mesh3];

//Light

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

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
 * Group
 */

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

/**
 * 3D Text
 */

 const fontLoader = new FontLoader()
 fontLoader.load("/fonts/helvetiker_regular.typeface.json",(font)=>{
     const textGeometry = new TextGeometry("MY PORTFOLIO", {
         font: font,
         size: 0.3,
         height: 0.2,
         curveSegments: 12,
         bevelEnabled: true,
         bevelThickness: 0.03,
         bevelSize: 0.02,
         bevelOffset: 0,
         bevelSegments: 5,
       });

       const textGeometry2 = new TextGeometry("MY PROJECTS", {
        font: font,
        size: 0.3,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      const textGeometry3 = new TextGeometry("CONTACT ME", {
        font: font,
        size: 0.3,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

       const material = new THREE.MeshMatcapMaterial()
       material.matcap = matCapTexture
       const text1 = new THREE.Mesh(textGeometry, material);
       const text2 = new THREE.Mesh(textGeometry2, material);
       const text3 = new THREE.Mesh(textGeometry3, material);

       text1.position.x = -3
       text2.position.x =  0
       text3.position.x = -3

       text1.position.y = objectDistance*0
       text2.position.y = -objectDistance
       text3.position.y = -objectDistance*2

       cameraGroup.add(text1,text2,text3);
 })
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Particles
 */
const count = 200;
const geometry = new THREE.BufferGeometry();
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positionArray[i * 3 + 1] =
    objectDistance * 0.5 - Math.random() * objectDistance * 3;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const positionBufferAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute("position", positionBufferAttribute);

const pointmaterial = new THREE.PointsMaterial({
  size: 0.03,
  sizeAttenuation: true,
  color: parameters.materialColor,
});

const points = new THREE.Points(geometry, pointmaterial);
cameraGroup.add(points);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // to remove that elastic scrolling effect giving the same background color as canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Mouse Move event
 */
let cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Scroll event
 */

let ScrollY = window.scrollY;
let currentIndex = 0;

window.addEventListener("scroll", () => {
  ScrollY = window.scrollY;

  const newSection = Math.round(ScrollY / sizes.height);
  if (newSection != currentIndex) {
    currentIndex = newSection;
    /**
     * Gsap Animation with specific section scroll
     */
    gsap.to(sectionMeshes[currentIndex].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=2",
    });
  }
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Animate camera
  camera.position.y = (-ScrollY / sizes.height) * objectDistance;
  // To the camera with exact distance as the page scrolls
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 4 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 4 * deltaTime;
  // Not every computer has same frequency rates so for keeping the frequency rate constant we need to check the time diffrence between each frame and calculate the distance as per the frequency rate

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1; // changing to += because we are animating with gsap too!
    mesh.rotation.y += deltaTime * 0.12;
  }
//   // Update controls
//   controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
