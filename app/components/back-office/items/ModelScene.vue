<template>
  <TresOrthographicCamera ref="camera" :near="-1000" :far="1000" :zoom="4" />
  <OrbitControls :min-polar-angle="minPolarAngle" :max-polar-angle="maxPolarAngle" />
  <TresAmbientLight :intensity="0.5" :color="0xffffff" />
  <TresDirectionalLight :position="[0, 80, -50]" :intensity="1.4" />
  <Suspense>
    <UseLoader :loader="STLLoader" :url="url" v-slot="{ data }">
      <TresMesh
        ref="geometryRef"
        :geometry="geometry = data as BufferGeometry"
        :rotate-x="-Math.PI / 2"
      >
        <TresMeshPhysicalMaterial
          :color="0x555555"
          :metalness="0.4"
          :roughness="0.8"
          :clearcoat="1"
          :clearcoatRoughness="1"
          :side="DoubleSide"
        />
      </TresMesh>
    </UseLoader>
  </Suspense>
</template>
<script setup lang="ts">
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import {
  type OrthographicCamera,
  Box3,
  Vector3,
  type BufferGeometry,
  DoubleSide,
  type BufferAttribute
} from 'three'
import { UseLoader, onTresReady } from '@tresjs/core'

defineProps<{
  url: string
}>()

const geometry = ref<BufferGeometry | null>(null)
const camera = ref<OrthographicCamera | null>(null)

const minPolarAngle: number = Math.PI / 2 - Math.PI / 6
const maxPolarAngle: number = Math.PI / 2 + Math.PI / 6

function autoFitOrthoCamera() {
  const bufferAttrs = geometry.value!.attributes.position as BufferAttribute
  const box = new Box3().setFromBufferAttribute(bufferAttrs)
  const size = new Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z)
  camera.value!.position.set(maxDim, maxDim, -maxDim / 1.5)
  camera.value!.updateProjectionMatrix()
}

onTresReady(() => {
  if (geometry.value) {
    geometry.value.computeVertexNormals()
    geometry.value.center()
    geometry.value.scale(1, 1, 1)
    autoFitOrthoCamera()
  }
})
</script>
