import { useCallback, useState, useRef, useEffect } from 'react'
import { message, Modal } from 'antd'
import HttpStatus from 'http-status-codes'

import useMountedState from './useMountedState'

import HTTPError from 'utils/httpError'

export interface IAsyncState<T> {
  loading: boolean
  error: HTTPError | null
  result: T | null
}

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  IAsyncState<Result>,
  (...args: Args) => Promise<Result | null>
]

export interface IUseFetchEffectOptions {
  initialLoadingState?: boolean
  enableDefaultErrorHandle?: boolean
  resetResult?: boolean
}

const DEFAULT_OPTIONS = {
  initialLoadingState: false,
  enableDefaultErrorHandle: true,
  resetResult: false
}

function defaultErrorHandle (error: HTTPError) {
  let httpErrorTitle: string
  try {
    httpErrorTitle = HttpStatus.getStatusText(error.code)
  } catch (e) {
    httpErrorTitle = 'Failed to fetch'
  }
  if (error.method === 'GET') {
    message.error(`[${httpErrorTitle}]: ${error.message}`)
  } else {
    Modal.error({
      title: httpErrorTitle,
      content: error.message
    })
  }
}

type SetState<T> = (s: IAsyncState<T>) => void

function useFetchEffect<Result = any, Args extends any[] = any[]> (
  asyncFn: (...args: Args) => Promise<Result | null>,
  options?: IUseFetchEffectOptions
): AsyncFn<Result, Args> {
  const { enableDefaultErrorHandle, initialLoadingState, resetResult } = Object.assign({}, DEFAULT_OPTIONS, options)

  const [state, setState] = useState<IAsyncState<Result>>({ loading: initialLoadingState, error: null, result: null })

  const getMounted = useMountedState()

  const { result, error, loading } = state

  const secureSetState = useCallback<SetState<Result>>(
    nextState => {
      if (getMounted()) {
        const { result: nextResult, error: nextError, loading: nextLoading } = nextState
        const isChanged = result !== nextResult || error !== nextError || loading !== nextLoading
        if (isChanged) {
          setState(nextState)
        }
      }
    },
    [error, getMounted, loading, result]
  )

  const secureSetStateRef = useRef(secureSetState)
  secureSetStateRef.current = secureSetState

  const resultRef = useRef(result)
  resultRef.current = result

  const execute = useCallback(
    async (...args: Args) => {
      if (resetResult) {
        secureSetStateRef.current({
          result: null,
          error: null,
          loading: true
        })
      } else {
        secureSetStateRef.current({
          result: resultRef.current,
          error: null,
          loading: true
        })
      }
      try {
        const value = await asyncFn(...args)
        secureSetStateRef.current({
          result: value,
          error: null,
          loading: false
        })
        return value
      } catch (error) {
        secureSetStateRef.current({
          result: resultRef.current,
          error,
          loading: false
        })
      }
      return null
    },
    [resetResult, asyncFn]
  )

  useEffect(() => {
    if (error && enableDefaultErrorHandle) {
      defaultErrorHandle(error)
    }
  }, [enableDefaultErrorHandle, error])

  return [state, execute]
}

export default useFetchEffect
