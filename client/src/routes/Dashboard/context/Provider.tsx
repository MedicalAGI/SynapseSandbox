import React, { useState, useMemo } from 'react'

import { NodeConfigurationContext, IFormModeContentContextValue } from './Context'

export const NodeConfigurationContextProvider = ({ children }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewContent, setPreviewContent] = useState('')
  const [addFieldKey, setAddFieldKey] = useState(0)
  const [template, setTemplate] = useState<any>()
  const [option, setOption] = useState<any>()
  const [nodesOutput, setNodesOutput] = useState<any[]>([])
  const [isClickOutput, setIsClickOutput] = useState(false)
  const [outputFieldKey, setOutputFieldKey] = useState(0)

  const value = useMemo<IFormModeContentContextValue>(
    () => ({
      isDrawerVisible,
      setDrawerVisible,
      previewTitle,
      setPreviewTitle,
      previewContent,
      setPreviewContent,
      addFieldKey,
      setAddFieldKey,
      template,
      setTemplate,
      option,
      setOption,
      nodesOutput,
      setNodesOutput,
      isClickOutput,
      setIsClickOutput,
      outputFieldKey,
      setOutputFieldKey
    }),
    [addFieldKey, isClickOutput, isDrawerVisible, nodesOutput, option, outputFieldKey, previewContent, previewTitle, template]
  )

  return (
    <NodeConfigurationContext.Provider value={value}>{children}</NodeConfigurationContext.Provider>
  )
}
