import { appFetch } from 'utils/fetch'

export const runFlow = async (params: any): Promise<any> => {
  const result = await appFetch({
    resource: 'api/run_flow',
    method: 'POST',
    payload: params
  })
  return result
}

export const getTemplates = async (): Promise<any> => {
  const result = await appFetch({
    resource: 'api/get_templates'
  })
  return result
}
