import { useContext } from 'react'

import { NodeConfigurationContext } from './Context'

export { NodeConfigurationContextProvider } from './Provider'

export function useNodeConfigurationContext () {
  return useContext(NodeConfigurationContext)
}
