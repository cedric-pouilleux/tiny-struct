<template>
  <ul class="mt-2">
    <li
      v-for="variant in variants"
      :key="variant.id"
      class="p-1"
      :class="{
        'bg-gray-100 p-2 my-2 border-t-1 border-t-gray-300': openVariant.variantId === variant.id
      }"
    >
      <div
        class="flex items-center justify-between gap-4"
        v-if="openVariant.variantId !== variant.id"
      >
        <ItemVariantInfos
          :id="variant.id"
          :price="variant.price"
          :scale="variant.scale"
          :created-at="getFormatedDate(variant.createdAt)"
          :description="variant.translations[locale]"
          :publish="variant.publish"
        />
        <ItemVariantActions
          :last-edit-date="getFormatedDate(variant.createdAt)"
          @remove="handleRemoveVariant(variant)"
          @edit="toggleVariantForm(variant.itemId!, variant)"
        />
      </div>
      <ItemVariantForm
        v-if="isSelectVariantFormOpen(variant.itemId, variant.id)"
        v-model="currentVariant"
        class="p-2"
        @save="handleSaveVariant"
        @close="closeVariantForm"
      />
    </li>
  </ul>
  <ItemVariantForm
    v-if="newFormOpen && !openVariant.itemId"
    v-model="currentVariant"
    class="mt-3"
    @save="handleSaveVariant"
  />
</template>

<script lang="ts" setup>
import ItemVariantInfos from '../items/ItemVariantInfos.vue'
import ItemVariantActions from '../items/ItemVariantActions.vue'
import ItemVariantForm from './ItemVariant.form.vue'
import { addItemVariant, editItemVariant, removeItemVariant } from '~/services/itemVariantService'
import { type ItemVariantInsert } from '~/server/db/schema'
import type { ItemReponse } from '~/server/api/item/all.get'

const props = defineProps<{
  itemId: number
  variants: ItemReponse['variants']
}>()

const newFormOpen = defineModel<boolean>({ required: true })

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const { locale, availableLocales } = useI18n()
const { getFormatedDate } = useDateUtils()
const { toastError, itemVariantSuccess } = useServiceToast()

interface OpenVariantState {
  itemId: number | null
  variantId: number | null
}

const openVariant = ref<OpenVariantState>({ itemId: null, variantId: null })

const defaultVariant: Partial<ItemVariantInsert> = {
  id: undefined,
  itemId: undefined,
  scaleId: undefined,
  price: undefined,
  stlFile: undefined,
  publish: undefined,
  translations: Object.fromEntries(availableLocales.map((loc) => [loc, '']))
}

const currentVariant = reactive<Partial<ItemVariantInsert>>({
  ...defaultVariant
})

function resetCurrentVariant() {
  Object.assign(currentVariant, { ...defaultVariant })
}

function setCurrentVariant(variant: ItemVariantInsert) {
  Object.assign(currentVariant, { ...variant })
}

function isSelectVariantFormOpen(itemId: number, variantId: number) {
  return openVariant.value.itemId === itemId && openVariant.value.variantId === variantId
}

function closeVariantForm() {
  openVariant.value = { itemId: null, variantId: null }
  resetCurrentVariant()
}

function openVariantForm(itemId: number, variant?: ItemVariantInsert) {
  openVariant.value = {
    itemId,
    variantId: variant?.id ?? null
  }

  if (variant) {
    setCurrentVariant(variant)
  } else {
    resetCurrentVariant()
    currentVariant.itemId = itemId
  }
}

function toggleVariantForm(itemId: number, variant?: ItemVariantInsert) {
  newFormOpen.value = false
  const sameVariantIsOpen =
    openVariant.value.itemId === itemId && openVariant.value.variantId === (variant?.id ?? null)
  if (sameVariantIsOpen) {
    closeVariantForm()
  } else {
    openVariantForm(itemId, variant)
  }
}

watch(
  () => newFormOpen.value,
  (isOpen) => {
    if (isOpen) {
      openVariant.value = { itemId: null, variantId: null }
      resetCurrentVariant()
    }
  }
)

async function handleSaveVariant() {
  currentVariant.id ? await editVariant() : await addVariant()
}

async function handleRemoveVariant(variant: ItemReponse['variants'][number]) {
  try {
    await removeItemVariant(variant.id)
    itemVariantSuccess(variant.id, variant.itemId, 'removed')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function addVariant() {
  try {
    const variant = await addItemVariant(
      currentVariant.itemId ? currentVariant : { ...currentVariant, itemId: props.itemId }
    )
    itemVariantSuccess(variant.id, variant.itemId, 'added')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function editVariant() {
  try {
    const { variantId } = await editItemVariant(currentVariant)
    itemVariantSuccess(variantId, currentVariant.itemId!, 'edited')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
