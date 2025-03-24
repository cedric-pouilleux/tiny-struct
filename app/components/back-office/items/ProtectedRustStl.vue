<template>
  <div ref="canvasContainer" class="w-full h-full" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

// Import du module WebAssembly compilé
import init, { get_test_model } from '~/public/wasm/stl_loader.js'

const canvasContainer = ref<HTMLElement>()

onMounted(async () => {
  // Init WASM
  await init()
  const vertices = get_test_model()

  // Création de la scène
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.z = 2

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(400, 400) // taille fixe pour l'exemple
  canvasContainer.value!.appendChild(renderer.domElement)

  // Création de la géométrie
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)
    mesh.rotation.y += 0.01
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
