import { CopyOutlined, DeleteOutlined, QuestionCircleOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Form,
  FormInstance,
  Tooltip
} from 'antd'
import React, { FC, useRef } from 'react'

import styles from './style.module.css'
import ParsingContentInput from './NodeContentInput'

import { noop } from 'utils/function'
import { colorList } from 'routes/Dashboard/constants'
import { useNodeConfigurationContext } from 'routes/Dashboard/context'

interface INodeContentProps {
  fieldKey: number
  form: FormInstance<any>
  rootRef: React.RefObject<HTMLDivElement>
  isLoading: boolean
  onAddNode?: (values: object) => void
  onDeleteNode?: (name: number) => void
}

const NodeContent: FC<INodeContentProps> = ({
  form,
  fieldKey,
  isLoading,
  onAddNode = noop,
  onDeleteNode = noop
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { setIsClickOutput, setOutputFieldKey, nodesOutput, setDrawerVisible, setPreviewTitle, setPreviewContent } = useNodeConfigurationContext()

  return (
    <div key={fieldKey} className={styles.node} style={{
      border: `10px solid ${colorList[fieldKey % colorList.length]}`
    }}>
      <div className={styles.header}>
        <Form.Item label='' noStyle style={{ height: 40 }}>
          <span style={{ marginLeft: 10 }}>
            {`Node${fieldKey + 1}`}
            <Tooltip
              overlayClassName={styles.tooltip}
              title={
                <span style={{ color: '#333333' }}>
                  This is a prompt node.
                </span>
              }
            >
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        </Form.Item>

        {(() => {
          return (
            (
              <Form.Item noStyle>
                <div>
                  <Tooltip title={isLoading ? 'running flow' : 'Node output Preview'}>
                    <EyeOutlined
                      onClick={() => {
                        if (!isLoading) {
                          if (nodesOutput[fieldKey]) {
                            setDrawerVisible(true)
                            setPreviewTitle(`Node_${fieldKey + 1} output preview`)
                            const output = nodesOutput[fieldKey]?.extra_output ? `output:${nodesOutput[fieldKey]?.output}\nextract output: ${nodesOutput[fieldKey]?.extra_output}` : nodesOutput[fieldKey]?.output
                            setPreviewContent(output)
                          } else {
                            setIsClickOutput(true)
                            setOutputFieldKey(fieldKey)
                          }
                        }
                      }}
                      style={{ marginRight: 10, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    />
                  </Tooltip>

                  <Tooltip title='Copy'>
                    <CopyOutlined
                      onClick={() => {
                        onAddNode(fieldKey === 0
                          ? {
                              content: [{ key: 'name', value: '' }].concat(form.getFieldValue(['nodes', fieldKey])?.content?.slice(1, 3)).concat(form.getFieldValue(['nodes', fieldKey])?.content?.slice(4))
                            }
                          : {
                              content: [{ key: 'name', value: '' }].concat(form.getFieldValue(['nodes', fieldKey])?.content?.slice(1))
                            })
                      }}
                      style={{ marginRight: 10 }}
                    />
                  </Tooltip>

                  <Tooltip title='Delete'>
                    <DeleteOutlined
                      onClick={() => {
                        onDeleteNode(fieldKey)
                      }}
                      style={{ marginRight: 10 }}
                    />
                  </Tooltip>
                </div>
              </Form.Item>
            )
          )
        })()}
      </div>

      <div className={styles.content} ref={contentRef}>

        <ParsingContentInput
          form={form}
          rootRef={contentRef}
          fieldKey={fieldKey}
        />
      </div>
    </div>
  )
}

export default NodeContent
