import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

function randomInRange(min, max) {
    return Math.random() * (max - min) + min
}
function createAndPlaceMeshesOutsideTheHouse(group, geom, mat, nb, zRot=0, scaleX = [1, 1], scaleY = [1, 1], scaleZ = [1, 1]) {
    for (let i = 0; i < nb; i++) {
        const randz = (Math.random() - 0.5) * 23.5
        const randx = (Math.random() - 0.5) * 23.5
        // no bush inside the house or in front of the door
        if ((randx < 4.8 && randx > -4.8) && (randz > -4.8 && randz < 4.8) || (randx > - 2 && randx < 2 && randz > 4)) {
        } else {
            const bush = new THREE.Mesh(geom, mat)
            bush.position.y = 1 / 2
            bush.position.z = randz
            bush.position.x = randx
            bush.scale.set(
                randomInRange(scaleX[0], scaleX[1]),
                randomInRange(scaleY[0], scaleY[1]),
                randomInRange(scaleZ[0], scaleZ[1])
            )
            bush.rotateY((Math.random() - 0.5) * 0.7)
            bush.rotateZ((Math.random() - 0.5) * zRot)
            bush.castShadow = true
            group.add(bush)
        }
    }
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const fog = new THREE.Fog('#07423e', 1, 9)
scene.fog = fog

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAmbiantOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg")
const wallAmbiantOcclusionTexture = textureLoader.load("/textures/bricks/ambientOcclusion.jpg")
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg")
const wallRoughnessTexture = textureLoader.load("/textures/bricks/roughness.jpg")

const floorColorTexture = textureLoader.load("/textures/grass/color.jpg")
const floorAmbiantOcclusionTexture = textureLoader.load("/textures/grass/ambientOcclusion.jpg")
const floorNormalTexture = textureLoader.load("/textures/grass/normal.jpg")
const floorRoughnessTexture = textureLoader.load("/textures/grass/roughness.jpg")

const graveColorTexture = textureLoader.load("/textures/grave/Asphalt023L_1K_Color.jpg")
const graveAmbiantOcclusionTexture = textureLoader.load("/textures/grave/Asphalt023L_1K_AmbientOcclusion.jpg")
const graveNormalTexture = textureLoader.load("/textures/grave/Asphalt023L_1K_NormalDX.jpg")
const graveRoughnessTexture = textureLoader.load("/textures/grave/Asphalt023L_1K_Roughness.jpg")

floorColorTexture.wrapS = THREE.RepeatWrapping
floorAmbiantOcclusionTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorRoughnessTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorAmbiantOcclusionTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorRoughnessTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.repeat.set(8,8)
floorAmbiantOcclusionTexture.repeat.set(8,8)
floorNormalTexture.repeat.set(8,8)
floorRoughnessTexture.repeat.set(8,8)


/**
 * axes Helpers
 */
// const axesHelper = new THREE.AxesHelper(20)


/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(8, 3, 8),
    new THREE.MeshStandardMaterial({ 
        map: wallColorTexture,
        transparent: true,
        aoMap: wallAmbiantOcclusionTexture,
        normalMap: wallNormalTexture,
        roughnessMap: wallRoughnessTexture
})
)
walls.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(
    walls.geometry.attributes.uv.array, 2
))
walls.receiveShadow = true
walls.position.y = 3 * 0.5
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.sqrt(4**2 + 4**2), 3, 4, 1, 0, 0, 2 * Math.PI),
    new THREE.MeshStandardMaterial({color: "red"})
)
roof.position.y = 3 + 3 * 0.5
roof.rotateY(Math.PI / 4)
house.add(roof)

// door 
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.25, 2.1, 10, 10),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbiantOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.2,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.castShadow = true
door.receiveShadow = true
door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(
    door.geometry.attributes.uv.array, 2
))
door.position.z = 4.01
door.position.y = 2.1 * 0.5 - 0.1
house.add(door)

// bushes
// idea: random bushes outside the house
// inside the floor
const bushes = new THREE.Group()
scene.add(bushes)
const bushGeom = new THREE.SphereGeometry(1, 15, 15, 0, 2 * Math.PI, 0, Math.PI * 2);
const bushMat = new THREE.MeshStandardMaterial({color: "green"})
createAndPlaceMeshesOutsideTheHouse(bushes, bushGeom, bushMat, 29, 0.2, [0.7, 1.7], [1, 3], [0.7, 1.7])

// graves
const graves = new THREE.Group()
const graveGeom = new THREE.BoxGeometry(1, 1.8, 0.3)
const graceMat = new THREE.MeshStandardMaterial(
    {
        map: graveColorTexture,
        transparent: true,
        aoMap: graveAmbiantOcclusionTexture,
        normalMap: graveNormalTexture,
        roughnessMap: graveRoughnessTexture
    })
scene.add(graves)
createAndPlaceMeshesOutsideTheHouse(graves, graveGeom, graceMat, 50, 0.3)



// Floor
const floor = new THREE.Mesh(
    // new THREE.PlaneGeometry(25, 25),
    new THREE.CircleGeometry(20, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        transparent: true,
        aoMap: floorAmbiantOcclusionTexture,
        normalMap: floorNormalTexture,
        roughnessMap: floorRoughnessTexture
    })
)
floor.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(
    floor.geometry.attributes.uv.array, 2
))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#6888bd', 0.12)
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#6888bd', 0.12)
moonLight.position.set(4, 5, - 2)
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// door light
const doorLight = new THREE.PointLight("orange", 1, 10, 1)
doorLight.position.set(0, 2.2 + 0.3, 4.8)
house.add(doorLight)


/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("red", 3, 4)
// const ghost1 = new THREE.SpotLight("red", 10, 6, 0.2)
const ghost2 = new THREE.PointLight("yellow", 3, 9)
// ghost1.target = camera
// scene.add(ghost1.target)
const ghost3 = new THREE.PointLight("blue", 3, 9)
const ghost4 = new THREE.PointLight("green", 3, 9)
ghost1.position.set(6, 0, 0)
ghost2.position.set(0, 0, 6)
ghost3.position.set(-6, 0, 0)
ghost4.position.set(0, 0, -6)
scene.add(ghost1, ghost2, ghost3, ghost4)


/**
 * Resize
 */
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
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.maxPolarAngle = Math.PI / 2 - 0.03
controls.enableDamping = true
controls.minDistance = 6
controls.maxDistance = 19

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#07423e")

/**
 * Shadow
 */
renderer.shadowMap.enabled = true
ghost1.castShadow = true 
ghost2.castShadow = true 
ghost3.castShadow = true 
ghost4.castShadow = true 
moonLight.castShadow = true
doorLight.castShadow = true

floor.receiveShadow = true

/**
 * Optimisation
 */
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

ghost4.shadow.mapSize.width = 256
ghost4.shadow.mapSize.height = 256
ghost4.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

function moveghost(ghost, originDistance, speed, g, functionY, clockDirection) {
    if (g.r > 0) {
        return {r:--g.r, dir:g.dir}
    }
    else {
        ghost.position.y = functionY
    switch(g.dir) {
        case "z": ghost.translateZ(speed)
            break
        case "x": ghost.translateX(speed)
            break
        case "-x": ghost.translateX(-speed)
            break
        case "-z": ghost.translateZ(-speed)
            break
    }
    if (ghost.position.z < -originDistance|| ghost.position.z > originDistance || ghost.position.x > originDistance || ghost.position.x < -originDistance)
    {
        if (clockDirection) {
            switch(g.dir){
                case "z": g.dir = "-x"
                    ghost.position.z = originDistance
                    break
                case "-x": g.dir = "-z"
                    ghost.position.x = -originDistance
                    break
                case "-z": g.dir = "x"
                    ghost.position.z = -originDistance
                    break
                case "x": g.dir = "z"
                    ghost.position.x = originDistance
                    break
            }
        } else {

            switch(g.dir){
                case "-x": g.dir = "z"
                    ghost.position.x = -originDistance
                    break
                case "-z": g.dir = "-x"
                    ghost.position.z = -originDistance
                    break
                case "x": g.dir = "-z"
                    ghost.position.x = originDistance
                    break
                case "z": g.dir = "x"
                    ghost.position.z = originDistance
                    break
            }
        }
               return {r:30, dir:g.dir}
    }
    return {r:g.r, dir:g.dir}
}
    
}

let g1 = {
    r: 0,
    dir:"z"
}
let g2 = {
    r: 0,
    dir:"x"
}
let g3 = {
    r: 0,
    dir:"-z"
}
let g4 = {
    r: 0,
    dir:'-x'
}
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    g1 = moveghost(ghost1, 7, 0.06, g1, 2, true)
    g2 = moveghost(ghost2, 8, 0.04, g2, Math.cos(elapsedTime * 3) * 3 + 1, false)
    g3 = moveghost(ghost3, 9, 0.03, g3, Math.sin(elapsedTime * 2), false)
    g4 = moveghost(ghost4, 9, 0.05, g4, Math.sin(elapsedTime * 2), true)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()