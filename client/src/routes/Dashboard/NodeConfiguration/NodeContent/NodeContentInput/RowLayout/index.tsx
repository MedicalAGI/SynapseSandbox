import React, { FC, ReactNode } from 'react'
import { Col } from 'antd'

export interface IRowLayoutProps {
  cols: ReactNode[]
}

const RowLayout: FC<IRowLayoutProps> = ({ cols }) => (
  <>
    <Col span={7}>{cols[0]}</Col>
    <Col span={13}>{cols[1]}</Col>
    <Col span={4}>{cols[2]}</Col>
  </>
)

export default RowLayout
