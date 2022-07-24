import "./style/main.css";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
// Scene
const scene = new THREE.Scene();

// Red Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "blue" });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
/* Orthographic Camera has a square vision you need to define the distance how broad the square vision will be
 we multiply our large value of scene size with aspect ratio so that the mesh fits in our view otherwise it gets distorted 
 it is basically used to see the object with the same size even if we are closer or far from it*/

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1
// );
camera.position.z = 3;
// camera.position.x = 2;
// camera.position.y = 2;

// camera.lookAt(mesh.position);

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

// Renderer

const canvas = document.querySelector(".webgl");

//Controls
const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animation
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // mesh.rotation.y = elapsedTime;

  // camera.position.x = cursor.x*5
  // camera.position.y = cursor.y*5

  // We can just se the side faces and the top bottom but i want to see whats at the back of the cube
  // so we will use the sin and cos function for the rotation
  // camera.position.x = Math.sin(cursor.x*Math.PI*2)*3
  // camera.position.z = Math.cos(cursor.x*Math.PI*2)*3
  // camera.position.y = cursor.y * 5

  // camera.lookAt(mesh.position);
// To get a easing at damping
  controls.update()
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
