import './style/main.css'
import * as THREE from "three"

// Scene
const scene = new THREE.Scene()

// Red Cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:"blue"})
const mesh = new THREE.Mesh(geometry,material)

// Positioning mesh(object)
// mesh.position.x = 1,
// mesh.position.y = 1,
// mesh.position.z = 1
// Both works same 
mesh.position.set(1,1,1)

// Scaling the mesh(object)
// mesh.scale.x = 1
// mesh.scale.y = 3
// mesh.scale.z = 0.5
// Both works same 
mesh.scale.set(1,3,0.5)

// Rotating the mesh(object)
mesh.rotation.reorder("YXZ")
mesh.rotation.x = Math.PI *0.4,
mesh.rotation.y = Math.PI 

// scene.add(mesh)

// Creating a group 

const group = new THREE.Group()

group.position.y = 2

scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"red"})
)
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"green"})
)
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:"blue"})
)
group.add(cube3)

cube2.position.x = -2
cube3.position.x = 2

// It gives the length of the mesh(object) from the center of the screen 
// console.log(mesh.position.length())


// Axis Helper
// I can increase the length of axis by just putting the number inside the function
const axisHelper = new THREE.AxesHelper()
scene.add(axisHelper)

// Sizes
const sizes = {
    width:800,
    height:600
}

// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z = 4
camera.position.x = 1
camera.position.y = 1

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



