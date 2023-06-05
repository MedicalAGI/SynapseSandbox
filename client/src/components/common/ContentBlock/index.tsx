import React from 'react'
import { Card } from 'antd'
import { CardProps } from 'antd/lib/card'
import classNames from 'classnames'

import styles from './style.module.css'

export interface IContentBlockProps extends CardProps {
  children?: React.ReactNode
}

const ContentBlock: React.FC<IContentBlockProps> = ({ children, className, ...others }) => (
  <Card bordered={false} className={classNames(styles.root, className)} {...others}>
    {children}
  </Card>
)

export default ContentBlock
