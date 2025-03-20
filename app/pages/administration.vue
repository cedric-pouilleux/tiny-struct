<template>
  <div class="grid grid-cols-[3fr_1fr] gap-4">
    <div>
      <ItemsBloc />
    </div>
    <div>
      <CategoriesBloc />
      <USeparator class="py-3" type="dashed" />
      <ItemScale />
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoriesBloc from '~/components/back-office/categories/CategoriesBloc.vue'
import ItemScale from '~/components/back-office/scales/ScalesBloc.vue'
import ItemsBloc from '~/components/back-office/items/ItemsBloc.vue'
import ItemForm from '~/components/back-office/items/ItemForm.vue'

// TODO => Add loader & skeleton
const { status } = await useAsyncData('admin-datas-page', () =>
  Promise.all([useScaleStore().fetchScales(), useCategoryStore().fetchCategories()])
)
</script>
