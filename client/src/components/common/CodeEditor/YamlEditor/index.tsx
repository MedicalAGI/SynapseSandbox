import React, {
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle
} from 'react'
import AceEditor, { IAceEditorProps } from 'react-ace'
import { Ace } from 'ace-builds'
import jsYaml, { load, LoadOptions } from 'js-yaml'
import { useDebouncedCallback } from 'use-debounce'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-tomorrow'
import { isNil } from 'ramda'

import { noop } from 'utils/function'

interface IYamlEditorProps extends Omit<IAceEditorProps, 'mode' | 'theme' | 'editorProps'> {
  validateDelay?: number
  jsYamlLoadOptions?: LoadOptions
  onJsValueChange?: (value: ReturnType<typeof load>) => void
}

type IYamlEditorRef = Ace.Editor | undefined

const YamlEditor: ForwardRefRenderFunction<IYamlEditorRef, IYamlEditorProps> = (
  {
    value,
    defaultValue,
    jsYamlLoadOptions,
    validateDelay = 500,
    name = 'yaml-editor',
    onJsValueChange = noop,
    onLoad,
    ...others
  },
  ref
) => {
  const editorRef = useRef<Ace.Editor>()
  const sessionRef = useRef<Ace.EditSession>()

  const handleLoad = useCallback(
    (editor: Ace.Editor) => {
      editorRef.current = editor
      sessionRef.current = editor.getSession()
      if (onLoad) {
        onLoad(editor)
      }
    },
    [onLoad]
  )

  const handleValidate = useDebouncedCallback((value: string) => {
    const defaultOptions: LoadOptions = {
      onWarning: (message) => {
        console.log('onWarning', message)
      }
      // schema: ''
    }
    const options = { ...defaultOptions, ...jsYamlLoadOptions }
    try {
      const v = jsYaml.load(value, options)
      onJsValueChange(v)
      if (sessionRef.current) {
        sessionRef.current.setAnnotations([])
      }
    } catch (error) {
      if (sessionRef.current) {
        sessionRef.current.setAnnotations([
          {
            column: error.mark?.column || 0,
            row: error.mark?.line || 0,
            type: 'error',
            text: error.message
          }
        ])
      }
    }
  }, validateDelay)

  useEffect(() => {
    if (!isNil(value)) {
      handleValidate(value)
      return
    }
    if (!isNil(defaultValue)) {
      handleValidate(defaultValue)
    }
  }, [defaultValue, handleValidate, value])

  useImperativeHandle(ref, () => editorRef.current)

  return (
    <AceEditor
      {...others}
      value={value}
      defaultValue={defaultValue}
      mode='yaml'
      theme='tomorrow'
      name={name}
      editorProps={{ $blockScrolling: true }}
      onLoad={handleLoad}
    />
  )
}

export default forwardRef(YamlEditor)
