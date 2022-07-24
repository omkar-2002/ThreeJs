import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Material } from 'three'
import * as dat from "dat.gui"
/**
 * Base
 */
// DEBUG

const gui = new dat.GUI()
// Texture
const loadingManager = new THREE.LoadingManager()
const textureLoading = new THREE.TextureLoader(loadingManager)
const cubeTextureLoading = new THREE.CubeTextureLoader()

const textureGradient3 = textureLoading.load('/textures/gradients/3.jpg')
const texturemetalness = textureLoading.load('/textures/door/metalness.jpg')
const textureheight = textureLoading.load('/textures/door/height.jpg')
const textureNormal = textureLoading.load('/textures/door/normal.jpg')
const texturecolor = textureLoading.load('/textures/door/color.jpg')
const doorHeightTexture = textureLoading.load('/textures/door/height.jpg')
const doorroughnessTexture = textureLoading.load('/textures/door/roughness.jpg')
const textureambientOcclusion = textureLoading.load('/textures/door/ambientOcclusion.jpg')
const texturealpha = textureLoading.load('/textures/door/alpha.jpg')
const texturmatacap = textureLoading.load('/textures/matcaps/8.png')
// HDRI HAVEN is the website you will need to download the env views
const environmentTexture = cubeTextureLoading.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Creating a material

// const material = new THREE.MeshBasicMaterial()
// material.map = texturealpha,
// material.color.set("purple")
// material.transparent = true
// material.opacity = 0.5
// material.side = THREE.DoubleSide
// material.alphaMap = texturealpha
// material.wireframe = true

// Mesh Normal Material
// const material = new THREE.MeshNormalMaterial()

// Mesh MatCap Material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = texturmatacap
// material.transparent = true
// material.side = THREE.DoubleSide

// Mesh Depth Material
// It is used to show fogs in video games
// const material = new THREE.MeshDepthMaterial()

// Mesh Lambert Material (reacts to light)
// const material = new THREE.MeshLambertMaterial

// Mesh Phong Material which gives more clearer look 
// const material = new THREE.MeshPhongMaterial()

// Mesh Toon material to give a cartoonish effect
// const material = new THREE.MeshToonMaterial()

// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial()
// material.map = texturecolor
// // This texture is for the shadows inside obj
// material.aoMap = textureambientOcclusion
// material.displacementMap = doorHeightTexture
// // This is to increase the scale of the 3d ness you can say
// material.displacementScale = 0.05
// material.metalnessMap = texturemetalness
// material.roughnessMap = doorroughnessTexture
// // This texture is for the detailing
// material.normalMap = textureNormal
// material.transparent = true
// // This is to hide the black part and only white is visible
// material.alphaMap = texturealpha
// material.side = THREE.DoubleSide

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.1
material.envMap = environmentTexture
// Adding tweeks to debug
gui.add(material,'metalness').min(0).max(1).step(0.0001)
gui.add(material,'roughness').min(0).max(1).step(0.0001)
gui.add(material,'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material,'displacementScale').min(0).max(1).step(0.0001)
// material.flatShading = true
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,64,64),
    material
)
sphere.geometry.setAttribute('uv2',new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,100,100),
    material
) 
plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.3, 64, 128),
    material
)
torus.geometry.setAttribute('uv2',new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))

scene.add(sphere,plane,torus)
sphere.position.x = -1.5
torus.position.x = 1.5


// Adding Light

const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
    plane.rotation.y = elapsedTime * 0.2
    torus.rotation.y = elapsedTime * 0.2

    plane.rotation.x = elapsedTime * 0.3
    torus.rotation.x = elapsedTime * 0.3
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()