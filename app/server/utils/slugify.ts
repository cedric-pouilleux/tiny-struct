export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // enlève les accents
    .replace(/[\u0300-\u036f]/g, '') // retire les diacritiques
    .replace(/[^a-z0-9]+/g, '-') // remplace par des tirets
    .replace(/(^-|-$)/g, '') // retire tirets au début/fin
}
