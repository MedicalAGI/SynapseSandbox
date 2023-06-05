/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import React from 'react'
import { render } from 'react-dom'

import App from './App'

function renderApp (Component: React.FC<any>) {
  render(<Component />, document.getElementById('root'))
}

// Initial render
renderApp(App)

// Connect HMR
if ((module as any).hot) {
  ;(module as any).hot.accept(['./App'], () => {
    // Store definition changed, recreate a new one from old state
    renderApp(App)
  })
}
