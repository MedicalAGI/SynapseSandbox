import HttpStatus from 'http-status-codes'

export type HTTPMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'

export interface IHTTPErrorPayload {
  body?: any
  code: number
  method: HTTPMethod
  resource?: string
}
export default class HTTPError extends Error {
  code: number
  body?: any
  method: HTTPMethod
  title: string
  resource?: string

  constructor (payload: IHTTPErrorPayload) {
    const { body, code, method, resource } = payload

    let errorMsg: string
    try {
      errorMsg = HttpStatus.getStatusText(code)
    } catch (e) {
      errorMsg = 'Failed to fetch'
    }
    super(body?.message || errorMsg)
    this.title = `${code || 'error'}`
    this.body = body
    this.code = code
    this.method = method
    this.resource = resource
  }
}

export const isError = (status: number) =>
  `${status}`.startsWith('4') || `${status}`.startsWith('5')
