/* eslint-disable no-param-reassign */
import fetch from 'isomorphic-fetch'
import { isNil } from 'ramda'

import HttpError, { isError, HTTPMethod } from 'utils/httpError'

export enum ContentTypes {
  unspecified = 'unspecified',
  applicationJson = 'application/json',
  textPlain = 'text/plain',
  textHtml = 'text/html',
}

export type ContentType = keyof typeof ContentTypes

const processPayloadWithContentType = (contentType: ContentType, payload?: object) => {
  if (!isNil(payload)) {
    if (contentType === 'applicationJson') {
      return JSON.stringify(payload)
    }
  }
  return payload
}

const checkRepIsSpecifyType = (rep: Response, contentType: ContentTypes) =>
  rep.headers.get('Content-Type')?.toLocaleLowerCase().includes(contentType)

export const queryParamsStringify = (params?: object) => {
  let queryString = ''
  if (params) {
    const urlSearch = new window.URLSearchParams()
    Object.entries(params)
      .filter(([, value]) => !isNil(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            urlSearch.append(key, item)
          })
        } else {
          urlSearch.append(key, value)
        }
      })
    queryString = urlSearch.toString()
  }
  return queryString && `?${queryString}`
}

interface IDownload {
  fileName: string
  fileType: string
}

interface IFetchParam {
  server?: string
  prefix?: string
  version?: string
  resource?: string
  payload?: any
  params?: any
  contentType?: ContentType
  method?: HTTPMethod
  headers?: object
  credentials?: string
  download?: IDownload
  isTransformed?: boolean
}

export const getResourceUri = (
  p: Pick<IFetchParam, 'server' | 'prefix' | 'version' | 'resource' | 'params'>
) => {
  const { server, prefix, version = 'v1', resource, params } = p
  let uri = server || ''
  uri += prefix ? `/${prefix}` : ''
  uri += version ? `/${version}` : ''
  uri += resource ? `/${resource}` : ''
  uri += queryParamsStringify(params)
  return uri
}

const HTTPFetch = async ({
  server = '',
  prefix = '',
  version = '',
  resource,
  method = 'GET',
  params,
  payload,
  contentType = 'applicationJson',
  credentials = 'include',
  headers = {}
}: IFetchParam) => {
  const uri = getResourceUri({
    server,
    prefix,
    version,
    resource,
    params
  })
  const requestContentType = ContentTypes[contentType]

  headers = {
    ...headers,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': requestContentType
  }

  // set by browser automatically
  if (contentType === 'unspecified') {
    delete headers['Content-Type']
  }

  let status: number
  return fetch(uri, {
    method,
    body: processPayloadWithContentType(contentType, payload),
    headers,
    credentials
  } as any)
    .then(async (response: Response) => {
      status = response.status
      const isApplicationJsonType = checkRepIsSpecifyType(response, ContentTypes.applicationJson)

      let result = isApplicationJsonType ? response.json() : response.text()
      const isTextHtmlType = checkRepIsSpecifyType(response, ContentTypes.textHtml)
      // Nginx error
      if (isTextHtmlType) {
        result = Promise.resolve('Bad gateway')
      }
      return result
    })
    .then((body: any) => ({ status, body }))
    .then(({ body }: any) => {
      if (isError(status)) {
        throw new HttpError({
          body: body,
          code: status,
          method,
          resource
        })
      }
      return body
    })
    .catch((e) => {
      if (e instanceof HttpError) {
        throw e
      }
      throw new HttpError({ body: e, code: status, method, resource })
    })
}

export default HTTPFetch
// 方便vscode自动import
export const appFetch = HTTPFetch
