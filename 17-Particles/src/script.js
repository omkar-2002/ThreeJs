import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const pointLightTexture = textureLoader.load("/textures/particles/1.png")

/**
 * Points
 */

// const particle = new THREE.SphereBufferGeometry(1,32,32)
// const material = new THREE.PointsMaterial({
//     size:0.02,
//     sizeAttenuation: true
// })

// const point = new THREE.Points(particle,material)

// scene.add(point)

// Creating custom points with BufferGeometry

const geometry = new THREE.BufferGeometry
const count = 5000
const positionBufferArray = new Float32Array(count*3)
const ColorArray = new Float32Array(count*3)

for(let i = 0; i < count*3;i++){
    positionBufferArray[i] = (Math.random()-0.5) * 10
    ColorArray[i] = Math.random()
}

const positionBufferSetAttribute = new THREE.BufferAttribute(positionBufferArray,3)
const ColorBufferSetAttribute = new THREE.BufferAttribute(ColorArray,3)

geometry.setAttribute("position",positionBufferSetAttribute)
geometry.setAttribute("color",ColorBufferSetAttribute)


const material = new THREE.PointsMaterial({
    size:0.1,
    sizeAttenuation: true,
    transparent:true,
    alphaMap:pointLightTexture,
    // alphaTest:0.001,
    depthWrite: false, // This is to make the particle visible from one another (transparent)
    // depthTest: false
    // wireframe:true
    blending: THREE.AdditiveBlending, // This gives white color if there is a collission between the particle which is realistic and gives a glowing effect
    vertexColors:true
})

const points = new THREE.Points(geometry,material)
scene.add(points)
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
camera.position.z = 3
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

    //Animate each particle
    for(let i = 0;i < count*3;i++){
        let i3 = i*3
        let x =  geometry.attributes.position.array[i3]
        geometry.attributes.position.array[i3+1] = Math.sin(elapsedTime + x)

    }

    geometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()