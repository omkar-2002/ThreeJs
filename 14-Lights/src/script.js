import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { HemisphereLight, Vector2, Vector3 } from 'three'
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Theis light dosent reflect anything it is just a rays of light which is uniformly scattered on the mesh
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// This light here use all the reflection principle and shows dark and light parts perfectly
const directionalLight = new THREE.DirectionalLight("red", 0.5)
gui.add(directionalLight,'intensity').min(0).max(1).step(0.01)
directionalLight.position.set(1,2,2)
// scene.add(directionalLight)

// This light can produce 2 light colors from diffrent regions with reflecting effect
const hemiSpherLight = new THREE.HemisphereLight(0xff0000,0x0000ff,0.3)
scene.add(hemiSpherLight)

// The third parameter is the decay unit the light will get dimmer as the last unit reaches
const pointLight = new THREE.PointLight(0xffff00,0.5,10)
scene.add(pointLight)
pointLight.position.set(1,3,1)

// This light scatters in a reactangle area and only visible on meshStandard and meshPhysical material
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,2,3,2)
scene.add(rectAreaLight)
rectAreaLight.position.set(-1.5,0,-1.5)
rectAreaLight.lookAt(new Vector3())

// This behaves as a flashLight parameters are color,intensity,distance,angle,penumbra,decay
const spotLight = new THREE.SpotLight("green",1,6,Math.PI * 0.1,0.25,1)
scene.add(spotLight)
spotLight.position.set(0,2,3)
spotLight.target.position.x = -1.75
scene.add(spotLight.target)

// Adding Light Helpers

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.2)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemiSpherLight,0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(directionalLightHelper,hemisphereLightHelper,pointLightHelper,spotLightHelper)

window.requestAnimationFrame(()=>{
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
window.requestAnimationFrame(()=>{
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    rectAreaLightHelper.update()
})
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()