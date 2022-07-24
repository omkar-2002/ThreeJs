import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BufferGeometry } from "three";
// Scene
const scene = new THREE.Scene();

// Red Cube
// This extra last 3 parameters is to define triangles per face
// 1 means 2 triangle per face
// 2 means 8 triangle per face
// and wireframe = true means you can see the skelleton of the mesh
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1,2,2,2);

//Creating a BufferedGeometry own triangle

// const positionArray = new Float32Array([
//   0,0,0,
//   0,1,0,
//   0,0,1
// ])

// const positionAttribute = new THREE.BufferAttribute(positionArray,3)
const geometry = new THREE.BufferGeometry();
const count = 5;
const positionBufferArray = new Float32Array(count * 3 * 3);
// geometry.setAttribute('position',positionAttribute)

// Creating buffered triangles with own vertices using a for loop
for (let i = 0; i < count * 3 * 3; i++) {
  positionBufferArray[i] =( Math.random() - 0.5)*4
}
const positionBufferSetAttribute = new THREE.BufferAttribute(
  positionBufferArray,
  3
);
geometry.setAttribute("position", positionBufferSetAttribute);
// Creating your own geometry
// const geometry = new THREE.Geometry();

// Creating the vertices
// const vertex1 = new THREE.Vector3(0, 0, 0);
// geometry.vertices.push(vertex1);

// const vertex2 = new THREE.Vector3(0, 1, 0);
// geometry.vertices.push(vertex2);

// const vertex3 = new THREE.Vector3(1, 0, 0);
// geometry.vertices.push(vertex3);

// // Creating a face
// const face = new THREE.Face3(0, 1, 2);
// geometry.faces.push(face);

// Creating a for loop to get random length triangles
// for (let i = 0; i < 50; i++) {
//   for (let j = 0; j < 3; j++) {
//     geometry.vertices.push(
//       new THREE.Vector3(Math.random(), Math.random(), Math.random())
//     );
//   }
//   const vertexIndex = i * 3;
//   geometry.faces.push(
//     new THREE.Face3(vertexIndex, vertexIndex + 1, vertexIndex + 2)
//   );
// }
// const geometry = new THREE.BoxGeometry(1, 1, 1,2,2,2);
const material = new THREE.MeshBasicMaterial({
  color: "blue",
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = (event.clientY / sizes.height - 0.5) * -1;
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
