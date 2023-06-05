import React from 'react'
import { Layout as AntdLayout } from 'antd'

import Content from './Content'
import Routes from './Routes'
import styles from './style.module.css'

const Layout: React.FC = () => {
  return (
    <AntdLayout className={styles.root}>
      <AntdLayout className={styles.main}>
        <div className={styles.content}>
          <Content>
            <Routes />
          </Content>
        </div>
      </AntdLayout>
    </AntdLayout>
  )
}

export default Layout
