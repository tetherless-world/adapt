export const parseURI = (uri: string) => {
  try {
    let parsed = new URL(uri)
    if (parsed.hash) {
      return {
        id: parsed.hash.substr(1),
        source: parsed.origin + parsed.pathname,
        joinedBy: '#',
      }
    }
    
    let slashIndex = uri.lastIndexOf('/')
    
    return {
      id: uri.substr(slashIndex + 1, 0),
      source: uri.substr(0, slashIndex),
      joinedBy: '/',
    }
  } catch {
    return {id: '', source: '', joinedBy: '#'}
  }
}
