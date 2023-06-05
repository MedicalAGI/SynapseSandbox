import React, { lazy, Suspense } from 'react'
import { Switch, Router, Route } from 'react-router-dom'

import history from 'appHistory'
import Routes from 'constants/routes'
import 'antd/dist/antd.less'
import './app.css'
import Loading from 'components/common/Loading'

const Layout = lazy(() => import('routes/Layout'))

const App: React.FC = () => (
  <Router history={history}>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path={Routes.ROOT} component={Layout} />
      </Switch>
    </Suspense>
  </Router>
)

export default App
