<template>
  <UContainer class="sm:px-0 lg:px-0">
    <div ref="containerRef" class="relative w-full h-[600px] p-0 m-0">
      <canvas ref="canvasRef" class="w-full h-full"></canvas>
    </div>
  </UContainer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const containerRef = ref(null)
const canvasRef = ref(null)

const scene = new THREE.Scene()
let camera
const renderer = ref(null)
let controls

const updateSize = () => {
  if (!containerRef.value || !renderer.value) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  const aspect = width / height

  // Ajuste le frustum de la caméra orthographique pour éviter que l'objet soit tronqué
  const boundingBox = new THREE.Box3().setFromObject(scene.children[0])
  const size = boundingBox.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)

  const frustumSize = maxDim * 1.5 // Facteur pour éviter le troncage

  camera.left = (-frustumSize * aspect) / 2
  camera.right = (frustumSize * aspect) / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2
  camera.near = 0.1
  camera.far = 1000
  camera.updateProjectionMatrix()

  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(window.devicePixelRatio) // Meilleure qualité sur écrans HD
}

onMounted(async () => {
  await nextTick() // Assure que le DOM est prêt avant d'accéder aux dimensions

  // Charger le modèle STL
  const response = await fetch('/api/stl/test')
  const arrayBuffer = await response.arrayBuffer()
  const stlLoader = new STLLoader()
  const geometry = stlLoader.parse(arrayBuffer)

  // ✅ Matériau plastique brillant gris anthracite
  const plasticMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x555555, // Gris anthracite
    metalness: 0.4, // Légèrement métallique
    roughness: 0.8, // Surface brillante
    clearcoat: 1, // Effet de vernis pour brillance
    clearcoatRoughness: 1 // Réflexion douce
  })

  const mesh = new THREE.Mesh(geometry, plasticMaterial)
  mesh.castShadow = true // ✅ Permet au modèle de projeter une ombre
  scene.add(mesh)

  // ✅ Ajout du sol
  const groundSize = 50
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize)
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 }) // Matériau invisible avec ombre
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true // ✅ Permet au sol de recevoir une ombre
  scene.add(ground)

  // ✅ Activation des ombres
  renderer.value = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.value })
  renderer.value.shadowMap.enabled = true // Active les ombres
  renderer.value.shadowMap.type = THREE.PCFSoftShadowMap

  // ✅ Lumières avec ombres
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 15, 10) // Position haute pour bien éclairer
  directionalLight.castShadow = true // ✅ Permet à la lumière de projeter des ombres

  // Optimisation des ombres pour éviter les artefacts
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10

  scene.add(directionalLight)

  // Création de la caméra orthographique
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
  scene.add(camera)

  // Rotation et recentrage du modèle
  mesh.rotation.x = -Math.PI / 2
  let box = new THREE.Box3().setFromObject(mesh)
  let center = box.getCenter(new THREE.Vector3())

  mesh.position.x -= center.x
  mesh.position.z -= center.z
  box = new THREE.Box3().setFromObject(mesh)
  const minY = box.min.y
  mesh.position.y -= minY + 0.01 // ✅ Légère élévation pour éviter la superposition exacte avec le sol

  // 📌 Vue isométrique corrigée
  box = new THREE.Box3().setFromObject(mesh)
  const finalCenter = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3()).length()

  camera.position.set(size, size, -size) // Vue isométrique
  camera.lookAt(finalCenter)

  // Initialisation du WebGL Renderer
  updateSize() // Ajuste la taille du canvas au chargement

  // OrbitControls - Permet la rotation complète
  controls = new OrbitControls(camera, renderer.value.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  // Autorise un angle minimal de 30° au-dessus de l'horizon
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 6
  // Autorise un angle maximal de 30° en dessous de l'horizon
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 6
  controls.target.set(finalCenter.x, finalCenter.y, finalCenter.z)

  // Boucle d'animation
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.value.render(scene, camera)
  }
  animate()

  // Gestion du redimensionnement
  window.addEventListener('resize', updateSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>
