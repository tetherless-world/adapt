import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-use'
import { LoadingWrapper } from 'src/components'
import { useGetPolicy } from 'src/hooks/api'

export interface ViewProps {}

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

export const View: React.FC<ViewProps> = () => {
  let query = useQuery()
  let history = useHistory()
  let uri = query.get('uri')

  if (!uri) {
    history.push('/404')
  }

  const [policyRes, getPolicy] = useGetPolicy(uri ?? '')

  useEffect(() => {
    getPolicy()
  }, [getPolicy])

  let policy = policyRes.value

  return (
    <LoadingWrapper loading={policyRes?.loading}>
      <pre>{JSON.stringify(policy, null, 2)}</pre>
    </LoadingWrapper>
  )
}
