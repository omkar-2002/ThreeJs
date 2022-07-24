import './style/main.css'
import * as THREE from "three"
import gsap from "gsap"
// Scene
const scene = new THREE.Scene()

// Red Cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:"red"})
const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

// Sizes
const sizes = {
    width:800,
    height:600
}

// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z = 3
scene.add(camera)


const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({
    canvas
})

renderer.setSize(sizes.width,sizes.height)
const clock = new THREE.Clock
gsap.to(mesh.position,{duration:1,delay:1,x:2})
gsap.to(mesh.position,{duration:1,delay:2,x:-2})
gsap.to(mesh.position,{duration:1,delay:3,x:0})


const tick = ()=>
{
    const elapsedTime = clock.getElapsedTime()
// mesh.rotation.y += 0.01
// mesh.rotation.x += 0.01
// mesh.rotation.y = Math.tan(elapsedTime)
// mesh.position.x = Math.tan(elapsedTime)
// mesh.scale.z = Math.tan(elapsedTime)
renderer.render(scene,camera)
window.requestAnimationFrame(tick)
}

tick()





