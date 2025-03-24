<template>
  <!-- Canvas en background plein écran -->
  <div class="fixed top-0 left-0 w-full h-screen z-0">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const canvasRef = ref(null)

let renderer, camera, controls
const scene = new THREE.Scene()

// On stocke le frustumSize dans une variable globale
// afin de l'utiliser dans updateSize().
let dynamicFrustumSize = 10 // Valeur par défaut, qu'on mettra à jour ensuite

/**
 * Met à jour la taille du renderer et l'orthographic camera
 * selon la taille de la fenêtre (plein écran).
 */
function updateSize() {
  if (!renderer || !camera) return

  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height

  // On utilise dynamicFrustumSize pour "zoomer/dézoomer"
  const halfWidth = (dynamicFrustumSize * aspect) / 2
  const halfHeight = dynamicFrustumSize / 2

  camera.left = -halfWidth
  camera.right = halfWidth
  camera.top = halfHeight
  camera.bottom = -halfHeight
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
}

onMounted(async () => {
  await nextTick()

  // 1. Créer le renderer en full-screen
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvasRef.value
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 2. Créer la caméra orthographique
  //    On va ajuster son "frustumSize" plus tard dans updateSize().
  camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000)
  scene.add(camera)

  // 3. Lumières
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 15, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 4. Charger le modèle STL
  const response = await fetch('/api/stl/test')
  const arrayBuffer = await response.arrayBuffer()
  const stlLoader = new STLLoader()
  const geometry = stlLoader.parse(arrayBuffer)

  // 5. Matériau
  const plasticMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x555555,
    metalness: 0.4,
    roughness: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 1
  })

  // 6. Mesh du modèle
  const mesh = new THREE.Mesh(geometry, plasticMaterial)
  mesh.castShadow = true
  scene.add(mesh)

  // 7. Sol
  const groundGeometry = new THREE.PlaneGeometry(50, 50)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 8. Mettre le modèle à plat et le recentrer
  mesh.rotation.x = -Math.PI / 2

  // Calcul bounding box
  let box = new THREE.Box3().setFromObject(mesh)
  const center = box.getCenter(new THREE.Vector3())

  // Recentrage
  mesh.position.x -= center.x
  mesh.position.z -= center.z
  mesh.position.y -= box.min.y // Pose le modèle sur le sol

  // Recalcule bounding box après repositionnement
  box = new THREE.Box3().setFromObject(mesh)
  const size = box.getSize(new THREE.Vector3()).length()

  // 9. On "dézoome" en orthographique
  //    Par exemple, on veut un frustum 3 fois plus grand que la taille de l'objet
  dynamicFrustumSize = size * 2 // Ajuste ce facteur pour dézoomer davantage ou moins
  // => plus la valeur est grande, plus le modèle sera petit à l'écran

  // 10. Position de la caméra pour l'angle isométrique
  //     (En orthographicCamera, la distance n'affecte pas le zoom,
  //      mais change l'angle et l'éclairage.)
  camera.position.set(size * 1, size * 1, -size * 1)
  camera.lookAt(0, 0, 0)

  // 11. OrbitControls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 6
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 6
  controls.target.set(0, 0, 0)

  // 12. Boucle d'animation
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // 13. Forcer la mise à jour de la taille 1 frame plus tard
  requestAnimationFrame(() => {
    updateSize()
  })

  // 14. Écouter le vrai resize de la fenêtre
  window.addEventListener('resize', updateSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>
