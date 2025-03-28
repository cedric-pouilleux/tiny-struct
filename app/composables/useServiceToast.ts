export function useServiceToast() {
  const toast = useToast()

  function itemVariantSuccess(variantId: number, variantItemId: number, action: string) {
    toast.add({
      title: `Variant ${variantId} on Item ${variantItemId} successfully ${action}`,
      icon: 'mdi:success-bold',
      color: 'success'
    })
  }

  function defaultSuccessToaster(title: string): void {
    toast.add({
      title,
      icon: 'mdi:success-bold',
      color: 'success'
    })
  }

  function itemSuccess(itemId: number, action: string) {
    toast.add({
      title: `Item ID: ${itemId} successfull ${action}`,
      icon: 'mdi:success-bold',
      color: 'success'
    })
  }

  function itemScaleSuccess(scaleId: number, action: string) {
    toast.add({
      title: `Scale ${scaleId} successfull ${action}`,
      icon: 'mdi:success-bold',
      color: 'success'
    })
  }

  function itemCategorySuccess(categoryId: number, action: string) {
    toast.add({
      title: `Category id ${categoryId} successfull ${action}`,
      icon: 'mdi:success-bold',
      color: 'success'
    })
  }

  function toastError(code: string, message: string): void {
    toast.add({
      title: `Error code : ${code}`,
      description: message || 'Unknown error',
      icon: 'fa:remove',
      color: 'error'
    })
  }

  return {
    toastError,
    itemVariantSuccess,
    itemCategorySuccess,
    itemScaleSuccess,
    itemSuccess,
    defaultSuccessToaster
  }
}
