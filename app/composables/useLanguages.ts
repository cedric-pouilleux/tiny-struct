export function useLanguages() {
  const { availableLocales, t } = useI18n()

  const tabsLanguages = computed(() =>
    availableLocales.map((item) => ({
      label: t(`language.label.${item}`),
      value: item
    }))
  )

  return {
    tabsLanguages
  }
}
