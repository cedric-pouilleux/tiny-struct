import type { AccordionItem } from '@nuxt/ui'

export type Language = 'fr' | 'en' | 'es'

export function useLanguages() {
  const { availableLocales, t } = useI18n()

  const tabLanguages = computed(() =>
    availableLocales.map((item) => ({
      label: t(`language.label.${item}`),
      value: item
    }))
  )

  function recordLanguageDefaultField(): Record<string, string> {
    return Object.fromEntries(availableLocales.map((lang) => [lang, '']))
  }

  const accordionLanguages = computed<AccordionItem[]>(() =>
    availableLocales.map((language) => ({
      label: t(`language.label.${language}`),
      icon: getLanguageIcon(language),
      value: language
    }))
  )

  function getLanguageIcon(langue: Language): string | undefined {
    switch (langue) {
      case 'fr':
        return 'emojione-v1:flag-for-france'
      case 'es':
        return 'twemoji:flag-spain'
      case 'en':
        return 'twemoji:flag-us-outlying-islands'
    }
  }

  return {
    tabLanguages,
    accordionLanguages,
    recordLanguageDefaultField
  }
}
