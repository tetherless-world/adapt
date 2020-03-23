import { useState, useEffect } from 'react';

const domains = {
  'http://purl.org/twc/policy/example/dsa/': {
    attributes: [
      {
        label: 'frequencyRange',
        values: [
          {
            label: 'frequencyMin',
            type: 'float'
          },
          {
            label: 'frequencyMax',
            type: 'float'
          }
        ]
      }
    ]
  }
}


export default function useDomain (domainUri) {
  const [selectedDomain, setSelectedDomain] = useState()
  useEffect(() => {
    setSelectedDomain(domainUri)
  }, [])

  return domains[selectedDomain]
}
