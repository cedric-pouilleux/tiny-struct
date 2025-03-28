type TranslationEntry<K extends string = string> = {
  language: string
} & Record<K, string | undefined>

export function useTranslationField<T extends TranslationEntry<K>, K extends keyof T & string>(
  arrayRef: Ref<T[]>,
  key: K,
  lang: string
): ComputedRef<string> {
  return computed<string>({
    get() {
      return arrayRef.value.find((el) => el.language === lang)?.[key] ?? ''
    },
    set(value: string) {
      const entry = arrayRef.value.find((el) => el.language === lang)
      if (entry) {
        entry[key] = value as T[K]
      }
    }
  })
}
