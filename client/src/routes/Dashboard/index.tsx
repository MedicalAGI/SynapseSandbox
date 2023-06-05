import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Drawer, Form, message, Modal } from 'antd'
import classNames from 'classnames'
import { v4 as uuid } from 'uuid'
import { isEmpty } from 'ramda'

import style from './style.module.css'
import { NODE_CONTENT_DEFAULT_VALUE } from './NodeConfiguration/NodeContent/NodeContentInput/constants'
import NodeConfiguration from './NodeConfiguration'
import { NodeConfigurationContextProvider, useNodeConfigurationContext } from './context'
import { getNodes } from './utils'

import ContentBlock from 'components/common/ContentBlock'
import Loading from 'components/common/Loading'
import { YamlEditor } from 'components/common/CodeEditor'
import { getTemplates, runFlow } from 'api'
import useFetchEffect from 'hooks/useFetchEffect'

const Dashboard = () => {
  const [form] = Form.useForm()
  const {
    setDrawerVisible, template, previewTitle, setPreviewTitle, isDrawerVisible, previewContent, setPreviewContent,
    setTemplate, setOption, nodesOutput, setNodesOutput, isClickOutput, outputFieldKey, setIsClickOutput
  } = useNodeConfigurationContext()

  const [
    isDeleteAllNodesModalVisible,
    setDeleteAllNodesModalVisible
  ] = useState(false)

  const [nodes, setNodes] = useState<any[]>()
  const [flowId, setFlowId] = useState('')
  const [loading, setLoading] = useState(false)

  const timer = useRef<number | null>(null)

  const [{ result: templates }, getTemplatesFn] = useFetchEffect(getTemplates)
  const [{ result: flowResult, loading: runFlowLoading }, runFlowFn] = useFetchEffect(runFlow)

  useEffect(() => {
    if (!template) {
      getTemplatesFn()
    }
  }, [getTemplatesFn, template])

  useEffect(() => {
    if (templates) {
      setTemplate(templates.template)
      setOption(templates.option)
    }
  }, [getTemplatesFn, setOption, setTemplate, template, templates])

  // polling run flow status and updating results
  useEffect(() => {
    if (flowResult?.running) {
      setLoading(true)
      setDrawerVisible(false)
      timer.current = window.setInterval(() => {
        runFlowFn(
          {
            flow_id: flowId,
            nodes
          }
        )
      }, 500)
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [flowId, flowResult?.running, nodes, runFlowFn])

  useEffect(() => {
    if (flowResult && !flowResult?.running) {
      setLoading(false)
      // get title
      if (isClickOutput) {
        setPreviewTitle(flowResult?.error_message ? `Node_${outputFieldKey + 1} output error` : `Node_${outputFieldKey + 1} output preview`)
      } else {
        setPreviewTitle(flowResult?.error_message ? 'Chaining Output Error' : 'Chaining Output Result')
      }
      // get content
      let message = ''
      if (flowResult?.flow_rst) {
        message = flowResult?.flow_rst
      } if (flowResult?.error) {
        message = `error message: ${flowResult?.error_message}`
      } if (flowResult?.stop_flag && flowResult?.stop_node_index) {
        message = message + '\n' + `flow is terminated at the node${flowResult?.stop_node_index}`
      }
      setDrawerVisible(true)
      setIsClickOutput(false)
      setPreviewContent(message)
      // set node output
      if (flowResult?.node_infos && !isEmpty(flowResult?.node_infos)) {
        setNodesOutput(flowResult?.node_infos)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowResult, setDrawerVisible, setNodesOutput, setPreviewContent, setPreviewTitle])

  useEffect(() => {
    // click output preview case
    if (isClickOutput && !nodesOutput[outputFieldKey]) {
      form.validateFields()
        .then(values => {
          const nodeValues = values?.nodes?.slice(0, outputFieldKey + 1)?.map(item => item?.content)
          const nodes = getNodes(nodeValues, template)
          const flowId = uuid()
          setFlowId(flowId)
          setNodes(nodes)
          runFlowFn({
            flow_id: flowId,
            nodes
          })
        })
        .catch(errorInfo => {
          console.warn(errorInfo)
        })
    }
  }, [form, isClickOutput, nodesOutput, outputFieldKey, runFlowFn, template])

  const handleApplyChainConfiguration = useCallback((values: any) => {
    const content = values?.nodes?.map(item => item?.content)
    const nodes = getNodes(content, template)
    const flowId = uuid()
    setFlowId(flowId)
    setNodes(nodes)

    runFlowFn({
      flow_id: flowId,
      nodes
    })
  }, [runFlowFn, template])

  const handleValuesChange = useCallback(({ nodes }) => {
    // if changed node,clear node output behind the change node index
    let index = 0
    const changedNodes = nodes.filter(Boolean)

    if (nodes.length !== changedNodes.length) {
      // edit node case except the first nodexw
      index = nodes.findIndex(item => Boolean(item))
      if (nodesOutput?.length >= index + 1) {
        setNodesOutput(nodesOutput.slice(0, index))
      }
    } else {
      setNodesOutput([])
    }
  }, [nodesOutput, setNodesOutput])

  const handleDeleteNode = (nodeId: number) => {
    const nodes = form.getFieldValue(['nodes'])
    if (nodes?.length === 1) {
      // delete first node
      form.setFieldsValue({
        nodes: [{ content: NODE_CONTENT_DEFAULT_VALUE }]
      })
    } else {
      // delete the other nodes
      const nodesAfter = nodes.filter((_, index) => index !== nodeId)
      form.setFields([
        {
          name: ['nodes'],
          value: nodesAfter,
          errors: undefined
        }
      ])
    }
    message.success('Delete Successfully.')
  }

  return (
    <>
      <ContentBlock title='Prompt Flow' extra={
        <div className={style.action}>
          <Button className={classNames(style.button)} onClick={() => setDeleteAllNodesModalVisible(true)}>
            Clear All Nodes
          </Button>

          <Button type='primary'
            className={classNames(style.button)}
            onClick={form.submit}
            disabled={runFlowLoading || loading}
          >
            Complete Chaining
          </Button>
        </div>
      }>
        {(runFlowLoading || loading) && <Loading/>}

          <div className={style.container}>
            <Form
              form={form}
              onFinish={handleApplyChainConfiguration}
              initialValues={{
                nodes: [{ content: NODE_CONTENT_DEFAULT_VALUE }]
              }}
              onValuesChange={handleValuesChange}
            >
              <NodeConfiguration
                isLoading={runFlowLoading || loading}
                form={form}
                onDelete={handleDeleteNode}
              />
            </Form>
          </div>

        <Drawer
          title={previewTitle}
          mask={false}
          maskClosable={false}
          className={ previewTitle.includes('template') ? style.templateDrawer : style.drawer}
          placement='right'
          onClose={() => {
            setDrawerVisible(false)
          }}
          visible={isDrawerVisible}
          width={580}
          destroyOnClose
          headerStyle={{ fontSize: 8 }}
        >
          <YamlEditor
            value={previewContent}
            width='550px'
            height='100%'
          />
        </Drawer>
      </ContentBlock>

      <Modal
        maskClosable={false}
        title='Notice'
        visible={isDeleteAllNodesModalVisible}
        onOk={() => {
          setDeleteAllNodesModalVisible(false)
          form.resetFields()
        }}
        onCancel={() => setDeleteAllNodesModalVisible(false)}
        className={style.modal}
      >
        { 'Are you sure to delete all Nodes?'}
      </Modal>
    </>
  )
}

const DashboardWithProvider = () => (
  <NodeConfigurationContextProvider>
    <Dashboard />
  </NodeConfigurationContextProvider>
)

export default DashboardWithProvider
