import React, { useRef, useState } from 'react'
import { Form, Button, Modal, FormInstance } from 'antd'
import classNames from 'classnames'

import { useNodeConfigurationContext } from '../context'
import { colorList } from '../constants'

import styles from './style.module.css'
import NodeContent from './NodeContent'
import { NODE_CONTENT_DEFAULT_VALUE } from './NodeContent/NodeContentInput/constants'

interface ISourceConfigurationProps {
  form: FormInstance<any>
  onDelete(NodeId: number): void
  isLoading: boolean
}

const NodeConfiguration: React.FC<ISourceConfigurationProps> = ({
  form,
  isLoading,
  onDelete
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const { setDrawerVisible, setAddFieldKey } = useNodeConfigurationContext()

  const [
    isDeleteNodeConfigurationModalVisible,
    setDeleteNodeConfigurationModalVisible
  ] = useState(false)

  const [deleteNodeId, setDeleteNodeId] = useState<number>()

  const handleDeleteSource = (id: number) => {
    setDeleteNodeConfigurationModalVisible(true)
    setDeleteNodeId(id)
  }

  return (
    <div
      className={classNames(styles.root, {
        [styles.drawer]: false
      })}
      ref={rootRef}
    >
      <Form.List name={['nodes']}>
        {(fields, { add }) => (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {fields.map(({ key: fieldKey }) => {
                setAddFieldKey(fieldKey)
                return (
                  <div style={{ display: 'flex' }} key={fieldKey}>
                    <NodeContent
                      key={fieldKey}
                      fieldKey={fieldKey}
                      form={form}
                      rootRef={rootRef}
                      onAddNode={add}
                      onDeleteNode={handleDeleteSource}
                      isLoading={isLoading}
                    />
                    {fieldKey !== form.getFieldValue('nodes')?.length - 1 &&
                  <>
                    <div style={{ height: 24, background: colorList[fieldKey], marginTop: 210, width: 48, justifyContent: 'center' }}></div>
                  </>
                    }
                  </div>
                )
              })}
            </div>

            <Form.Item>
              <Button
                type='primary'
                onClick={() => {
                  setDrawerVisible(false)
                  add({
                    content: NODE_CONTENT_DEFAULT_VALUE.slice(0, 3)
                  })
                }
                }
              >
                + Add New Node
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Modal
        title='Notice'
        visible={isDeleteNodeConfigurationModalVisible}
        onOk={() => {
          setDeleteNodeConfigurationModalVisible(false)
          onDelete(deleteNodeId || 0)
        }}
        onCancel={() => setDeleteNodeConfigurationModalVisible(false)}
        className={styles.modal}
      >
        {deleteNodeId === 0 && form.getFieldValue('nodes').length === 1 ? 'This is the only node, delete will create a new empty node.' : 'Are you sure to delete this Node Configuration?'}
      </Modal>
    </div>
  )
}

export default NodeConfiguration
