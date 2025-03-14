<template>
  <h1>Add item</h1>

  <UForm :state="item" class="space-y-4" @submit="submit">
    <UFormField label="Name" name="item">
      <UInput v-model="item.name" />
    </UFormField>
    <UFormField label="Category" name="category">
      <USelect v-model="item.categoryId" :items="getCategories" class="w-48" />
    </UFormField>

    <div v-for="variant in item.variants">
      <UFormField label="Scale" name="scale">
        <USelect v-model="variant.scaleId" :items="getCategories" class="w-48" />
      </UFormField>
      <UFormField label="Stl file" name="stl_file">
        <UInput v-model="variant.stlFile" />
      </UFormField>
      <UFormField label="Description" name="description">
        <UTextarea v-model="variant.description" />
      </UFormField>
      <UFormField label="Price" name="description">
        <UInputNumber v-model="variant.price" />
      </UFormField>
    </div>

    <UButton type="submit"> Submit </UButton>
  </UForm>

  <!-- Variants -->
  <h2>Variations</h2>
  <UButton @click="addVariation"> Add variation </UButton>
  <div>
    <UFormField label="Scale" name="scale">
      <USelect v-model="item.variants[0].scaleId" :items="getCategories" class="w-48" />
    </UFormField>
    <UFormField label="Stl file" name="stl_file">
      <UInput v-model="item.variants[0].stlFile" />
    </UFormField>
    <UFormField label="Description" name="description">
      <UTextarea v-model="item.variants[0].description" />
    </UFormField>
    <UFormField label="Price" name="description">
      <UInputNumber v-model="item.variants[0].price" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import type { Category, Scale } from '~/server/db/schema'

const props = defineProps<{
  categories: Category[] | null
  scales?: Scale[]
}>()

const getCategories = computed(() =>
  props.categories?.map((item) => ({
    label: 'item.name',
    value: item.id
  }))
)

const item = reactive({
  name: 'Mini Parpaing',
  categoryId: 1,
  variants: [
    {
      scaleId: 1,
      description: 'Version 1:10',
      price: 10.99,
      stlFile: '/assets/models/mini-parpaing-1-10.stl'
    },
    {
      scaleId: 2,
      description: 'Version 1:12',
      price: 12.99,
      stlFile: '/assets/models/mini-parpaing-1-12.stl'
    }
  ]
})

function submit() {
  //submit payload item
}

function addVariation() {}
</script>
