import { createContext } from 'react'

import { noop } from 'utils/function'

export interface IFormModeContentContextValue {
  isDrawerVisible: boolean
  setDrawerVisible: (visible: boolean) => void
  previewTitle: string
  previewContent: string
  setPreviewTitle: (content: string) => void
  setPreviewContent: (content: string) => void
  addFieldKey: number
  setAddFieldKey: (fieldKey: number) => void
  template: any
  setTemplate: (template: any) => void
  option: any
  setOption: (option: any) => void
  nodesOutput: any[]
  setNodesOutput: (nodesOutput: any[]) => void
  isClickOutput: boolean
  setIsClickOutput: (isClickOutput: boolean) => void
  outputFieldKey: number
  setOutputFieldKey: (setOutputFieldKey: number) => void
}

const DEFAULT_VALUE = {
  isDrawerVisible: false,
  setDrawerVisible: noop,
  previewTitle: '',
  previewContent: '',
  setPreviewTitle: noop,
  setPreviewContent: noop,
  addFieldKey: 0,
  setAddFieldKey: noop,
  template: {},
  setTemplate: noop,
  option: {},
  setOption: noop,
  nodesOutput: [],
  setNodesOutput: noop,
  isClickOutput: false,
  setIsClickOutput: noop,
  outputFieldKey: 0,
  setOutputFieldKey: noop
}

export const NodeConfigurationContext = createContext<IFormModeContentContextValue>(DEFAULT_VALUE)
