import './style/main.css'
import * as THREE from "three"

// Scene
const scene = new THREE.Scene()

// Red Cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:"blue"})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

// It gives the length of the mesh(object) from the center of the screen 
// console.log(mesh.position.length())


// Sizes
const sizes = {
    width:800,
    height:600
}

// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z = 4
scene.add(camera)

// It gives distance between mesh and camera
// console.log(mesh.position.distanceTo(camera.position))

// Wherever your mesh is the normalize function will bring it to a unit far from the main axis
// mesh.position.normalize()

// Renderer

const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.render(scene,camera)


