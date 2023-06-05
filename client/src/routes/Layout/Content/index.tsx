import React, { FC } from 'react'

import style from './style.module.css'

const Content: FC = ({ children }) => {
  return (
    <div className={style.root}>
      <div className={style.content}>{children}</div>
    </div>
  )
}

export default Content
