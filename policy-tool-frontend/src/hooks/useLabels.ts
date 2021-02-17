import { useMemo } from 'react'

export const useLabels = (
  labelByURI: Record<string, string>,
  uris: string[]
) => {
  return useMemo(
    () =>
      uris
        .filter((uri) => uri in labelByURI)
        .map((uri) => labelByURI[uri])
        .map((label) => ({ label })),
    [labelByURI, uris]
  )
}
