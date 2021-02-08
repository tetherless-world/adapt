export const isValidURI = (source: string, id: string) => {
  try {
    let uri = new URL([source, id].join('#'))
  } catch {
    return false
  }
  return true
}
