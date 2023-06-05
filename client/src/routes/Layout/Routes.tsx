import React, { Suspense, lazy } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import Loading from 'components/common/Loading'
import ROUTES, { DEFAULT_ROUTER } from 'constants/routes'

const Dashboard = lazy(() => import('routes/Dashboard'))

const {
  DASHBOARD
} = ROUTES

const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path={DASHBOARD} component={Dashboard} />
        <Redirect to={DEFAULT_ROUTER} />
      </Switch>
    </Suspense>
  )
}

export default Routes
