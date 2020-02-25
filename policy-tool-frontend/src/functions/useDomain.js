import { useState, useEffect } from 'react';

const domains = {
  'http://purl.org/twc/policy/example/dsa/': {
    attributes: [
      {
        attribute: 'frequencyRange',
        values: [
          {
            title: 'frequencyMin',
            type: 'float'
          },
          {
            title: 'frequencyMax',
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
