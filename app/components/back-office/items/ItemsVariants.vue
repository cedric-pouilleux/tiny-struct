<template>
  <ul v-if="variants.length" class="mt-2">
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
          :stl-mold="variant.stlMold"
          :stl-master="variant.stlMaster"
          :stl-final="variant.stlFinal"
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
  <div v-else class="text-sm mt-2">No variants</div>
  <ItemVariantForm
    v-if="newFormOpen && !openVariant.itemId"
    v-model="currentVariant"
    class="mt-3"
    @save="handleSaveVariant"
    @close="newFormOpen = false"
  />
</template>

<script lang="ts" setup>
import ItemVariantInfos from '../items/ItemVariantInfos.vue'
import ItemVariantActions from '../items/ItemVariantActions.vue'
import ItemVariantForm from './ItemVariant.form.vue'
import { addItemVariant, editItemVariant, removeItemVariant } from '~/services/itemVariantService'
import type { ItemReponse } from '~/server/api/item/all.get'
import type { ItemVariantAddPayload } from '~/server/api/item/variant/add'
import type { ItemVariantEditPayload } from '~/server/api/item/variant/edit'

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

export type ItemVariantPayload = Partial<ItemVariantAddPayload & { id: number }>

const defaultVariant: Partial<ItemVariantAddPayload & ItemVariantEditPayload> = {
  id: undefined,
  itemId: undefined,
  scaleId: undefined,
  price: undefined,
  stlMasterFile: undefined,
  stlMoldFile: undefined,
  stlFinalFile: undefined,
  publish: undefined,
  translations: Object.fromEntries(availableLocales.map((loc) => [loc, '']))
}

const currentVariant = reactive<Partial<ItemVariantAddPayload & ItemVariantEditPayload>>({
  ...defaultVariant
})

function resetCurrentVariant() {
  Object.assign(currentVariant, { ...defaultVariant })
}

function setCurrentVariant(variant: ItemVariantPayload) {
  Object.assign(currentVariant, { ...variant })
}

function isSelectVariantFormOpen(itemId: number, variantId: number) {
  return openVariant.value.itemId === itemId && openVariant.value.variantId === variantId
}

function closeVariantForm() {
  openVariant.value = { itemId: null, variantId: null }
  resetCurrentVariant()
}

function openVariantForm(itemId: number, variant?: ItemVariantPayload) {
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

function toggleVariantForm(itemId: number, variant?: ItemVariantPayload) {
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

// TODO => Define optional payload for add item variant
async function addVariant() {
  if (
    !currentVariant.itemId &&
    !currentVariant.scaleId &&
    !currentVariant.price &&
    !currentVariant.stlFinalFile &&
    !currentVariant.stlMoldFile &&
    !currentVariant.stlMasterFile
  ) {
    return
  }
  try {
    const form = new FormData()
    form.append('itemId', props.itemId!.toString())
    form.append('scaleId', currentVariant.scaleId!.toString())
    form.append('price', currentVariant.price!.toString())
    form.append('publish', currentVariant.publish ? currentVariant.publish.toString() : 'false')
    form.append('stlFinalFile', currentVariant.stlFinalFile!)
    form.append('stlMoldFile', currentVariant.stlMoldFile!)
    form.append('stlMasterFile', currentVariant.stlMasterFile!)
    form.append('translations', JSON.stringify(currentVariant.translations))

    const variant = await addItemVariant(form)
    itemVariantSuccess(variant.id, variant.itemId, 'added')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

// TODO => Refacto edit variant send only value was change
async function editVariant() {
  try {
    const form = new FormData()
    form.append('id', currentVariant.id!.toString())
    form.append('scaleId', currentVariant.scaleId!.toString())
    form.append('price', currentVariant.price!.toString())
    form.append('publish', currentVariant.publish ? currentVariant.publish.toString() : 'false')

    currentVariant.stlFinalFile && form.append('stlFinalFile', currentVariant.stlFinalFile)
    currentVariant.stlMoldFile && form.append('stlMoldFile', currentVariant.stlMoldFile)
    currentVariant.stlMasterFile && form.append('stlMasterFile', currentVariant.stlMasterFile)
    form.append('translations', JSON.stringify(currentVariant.translations))

    const { variantId } = await editItemVariant(form)
    itemVariantSuccess(variantId, currentVariant.itemId!, 'edited')
    closeVariantForm()
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
