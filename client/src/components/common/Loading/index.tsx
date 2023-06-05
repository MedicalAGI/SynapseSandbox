import React, { FC } from 'react'
import { Spin } from 'antd'
import { SpinProps } from 'antd/lib/spin'

import styles from './style.module.css'

export interface ILoadingProps extends SpinProps {
  renderChildrenWhenLoading?: boolean
}

const Loading: FC<ILoadingProps> = ({ children, renderChildrenWhenLoading = true, spinning, style, ...others }) => {
  if ((!renderChildrenWhenLoading && spinning) || !children) {
    return (
      <div className={styles.spinWrapper} style={style}>
        <Spin spinning={spinning} {...others} />
      </div>
    )
  } else {
    return (
      <Spin style={style} spinning={spinning} {...others}>
        {children}
      </Spin>
    )
  }
}

export default Loading
