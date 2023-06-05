import React, { FC, useRef } from 'react'
import { Row, Button, Form, Input, Tooltip, Cascader, Select } from 'antd'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { isEmpty, isNil } from 'ramda'

import RowLayout from './RowLayout'
import styles from './style.module.css'
import { FIXED_NODE_CONTENT_KEYS, NODE_TYPE, POLICY_KEY } from './constants'

import { useNodeConfigurationContext } from 'routes/Dashboard/context'
import Loading from 'components/common/Loading'

interface IValue {
  [key: string]: object
}
export interface INodeContentInputProps {
  value?: IValue
  onChange?: (value: IValue) => void
  fieldKey: number
  form: FormInstance<any>
  rootRef: React.RefObject<HTMLDivElement>
}

const { Option } = Select

const NodeContentInput: FC<INodeContentInputProps> = ({ fieldKey, form }) => {
  const listRef = useRef<HTMLDivElement>(null)

  const { setDrawerVisible, setPreviewTitle, setPreviewContent, option, template } = useNodeConfigurationContext()

  return (
    <Form.List name={[fieldKey, 'content']}>
      {(fields, { add, remove }) => (
        <div className={styles.root}>
          <div className={styles.table}>
            <Row className={styles.header}>
              <RowLayout
                cols={[
                  'Key',
                  'Value',
                  'Action'
                ]}
              />
            </Row>
            <div className={styles.list} ref={listRef}>
              {fields.map((field) => {
                const { key, name: fieldName } = field
                // first node has fixed input key
                const isFixedField = fieldKey === 0 ? fieldName < FIXED_NODE_CONTENT_KEYS.length : fieldName < FIXED_NODE_CONTENT_KEYS.length - 1
                const isTypeField = fieldName === 1
                const isTemplateField = fieldName === 2
                return (
                  <Row className={styles.line} key={key}>
                    <RowLayout
                      cols={[
                          <>
                          <Form.Item noStyle shouldUpdate={(pre, cur) =>
                            (pre?.nodes?.[fieldKey]?.content?.[fieldName - 2]?.value) !==
                            (cur?.nodes?.[fieldKey]?.content?.[fieldName - 2]?.value)}>
                            {
                              ({ getFieldValue }) => {
                                const isPolicyType = getFieldValue(['nodes', fieldKey, 'content', fieldName - 2, 'value']) === NODE_TYPE.policy
                                return (
                                  isPolicyType && fieldKey !== 0
                                    ? <Form.Item
                                  key='key'
                                  name={[fieldName, 'key']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'key is required'
                                    }
                                  ]}
                                >
                                <Select allowClear placeholder='valid key' style={{ width: 80 }}>
                                  {
                                    Object.keys(POLICY_KEY).map(item => <Option value={POLICY_KEY[item]} key={item} label={item}>
                                      {item}
                                    </Option>)
                                  }
                                </Select>
                              </Form.Item>
                                    : <Form.Item
                                  key='key'
                                  name={[fieldName, 'key']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'key is required'
                                    }
                                  ]}
                                >
                                  <Input
                                    readOnly={isFixedField}
                                    placeholder='Input Key'
                                    style={
                                      isFixedField
                                        ? {
                                            border: 'none',
                                            outline: 'none',
                                            boxShadow: 'none'
                                          }
                                        : undefined
                                    }
                                  />
                              </Form.Item>)
                              }
                            }
                        </Form.Item>
                        </>,
                        <>
                          <Form.Item noStyle shouldUpdate={(pre, cur) =>
                            (pre?.nodes?.[fieldKey]?.content?.[fieldName - 1]?.value) !==
                            (cur?.nodes?.[fieldKey]?.content?.[fieldName - 1]?.value)}>
                            {
                              ({ getFieldValue }) => {
                                return isTemplateField && <Form.Item
                                key='value'
                                name={[fieldName, 'value']}
                                style={{ width: '100%' }}
                                rules={[{
                                  required: getFieldValue(['nodes', fieldKey, 'content', fieldName - 1, 'value']) === NODE_TYPE.policy,
                                  message: 'template is required'
                                }]}
                              >
                                <Cascader
                                  loading={isEmpty(option) || isNil(option)}
                                  options={option}
                                  showSearch
                                  placeholder='select template'
                                  dropdownRender={(menus) => (
                                    <Loading spinning={isEmpty(option) || isNil(option)}>
                                      {menus}
                                    </Loading>
                                  )}
                                  displayRender={label => label.pop()}
                                />
                              </Form.Item>
                              }
                            }
                          </Form.Item>

                          {
                            isTypeField && <Form.Item
                              key='value'
                              name={[fieldName, 'value']}
                              style={{ width: '100%' }}
                              rules={[
                                {
                                  required: true,
                                  message: 'type is required'
                                }
                              ]}
                            >
                              <Select allowClear placeholder='select node type'>
                                {
                                  Object.keys(NODE_TYPE).map(item => <Option value={NODE_TYPE[item]} key={item} label={item}>
                                    {item}
                                  </Option>)
                                }
                              </Select>
                            </Form.Item>
                          }

                          <Form.Item noStyle shouldUpdate={(pre, cur) =>
                            (pre?.nodes?.[fieldKey]?.content?.[fieldName]?.key) !==
                            (cur?.nodes?.[fieldKey]?.content?.[fieldName]?.key)}>
                            {
                              ({ getFieldValue }) => {
                                const isValidValue = Object.values(POLICY_KEY).includes(getFieldValue(['nodes', fieldKey, 'content', fieldName, 'key']))
                                if (isTemplateField || isTypeField) {
                                  return null
                                }
                                return isValidValue
                                  ? <Form.Item
                                key='value'
                                name={[fieldName, 'value']}
                                style={{ width: '100%' }}
                                rules={[{
                                  required: true,
                                  message: 'template is required'
                                }]}
                              >
                                <Select mode='tags' style={{ width: '100%' }} placeholder='Input Values'
                                  dropdownRender={(menus) => <div className={styles.info}>
                                  Input Values and enter
                                  {menus}
                                  </div>
                                  }
                                  />
                                </Form.Item>
                                  : <Form.Item
                                    key='value'
                                    name={[fieldName, 'value']}
                                    style={{ width: '100%' }}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'value is required'

                                      }
                                    ]}
                                  >
                                    <Input
                                      placeholder='Input Value'
                                      style={{ width: '100%' }}
                                    />
                                  </Form.Item>
                              }
                            }
                          </Form.Item>
                        </>,
                        <>
                          <Button
                            disabled={isFixedField}
                            key='action'
                            icon={<DeleteOutlined />}
                            onClick={() => remove(fieldName)}
                            style={{ marginRight: 8 }}
                          />
                          {isTemplateField &&
                          <Tooltip title='Preview Template'>
                            <Button
                              key='action'
                              style={{ width: 20 }}
                              icon={<EyeOutlined /> }
                              onClick={() => {
                                const templateValue = form.getFieldValue(['nodes', fieldKey, 'content', fieldName, 'value'])
                                const value = templateValue.join('/')
                                setDrawerVisible(true)
                                setPreviewTitle(`Node_${fieldKey + 1} template preview`)
                                if (isNil(template) || isEmpty(template)) {
                                  setPreviewContent('Please Select a Template First')
                                } else {
                                  setPreviewContent(template?.[value])
                                }
                              }}
                            />
                          </Tooltip>
                          }
                        </>

                      ]}
                    />
                  </Row>
                )
              })}
            </div>
          </div>
          <div className={styles.action}>
            <Button
              type='link'
              onClick={() => {
                add()
                setTimeout(() => {
                  if (listRef.current) {
                    listRef.current.scrollTo({
                      top: listRef.current.scrollHeight,
                      behavior: 'smooth'
                    })
                  }
                }, 30)
              }}
            >
              + Add New Key
            </Button>
          </div>
        </div>
      )}
    </Form.List>
  )
}

export default NodeContentInput
