export function useDateUtils() {
  const { locale } = useI18n()

  function getFormatedDate(date: Date): string {
    return new Date(date).toLocaleString(locale.value, {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return {
    getFormatedDate
  }
}
