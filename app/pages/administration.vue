<template>
  <div class="grid grid-cols-[3fr_1fr] gap-4">
    <div>
      <!-- <ItemsBloc /> -->
    </div>
    <div>
      <CategoriesBloc />
      <USeparator class="py-3" type="dashed" />
      <ItemScale />
      <USeparator class="py-3" type="dashed" />
      <MaterialBloc />
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoriesBloc from '~/components/back-office/categories/CategoriesBloc.vue'
import ItemScale from '~/components/back-office/scales/ScalesBloc.vue'
// import ItemsBloc from '~/components/back-office/items/ItemsBloc.vue'
import MaterialBloc from '~/components/back-office/materials/MaterialsBloc.vue'

// TODO => Add loader & skeleton
const { status } = await useAsyncData('admin-datas-page', () =>
  Promise.all([
    useScaleStore().fetchScales(),
    useCategoryStore().fetchCategories(),
    useMaterialsStore().fetchMaterials()
  ])
)
</script>
