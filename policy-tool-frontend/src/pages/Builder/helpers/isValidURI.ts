export const isValidURI = (source: string, id: string) => {
  try {
    void new URL([source, id].join('#'))
  } catch {
    return false
  }
  return true
}
