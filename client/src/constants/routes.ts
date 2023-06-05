export enum PARAMS {}

const ROOT = '/'

const DASHBOARD = `${ROOT}dashboard`

export enum ROUTE_TYPES {
  root = 'ROOT',
  dashboard = 'DASHBOARD',
}

type IRoutes = {
  [name in ROUTE_TYPES]: string
}

const ROUTES: IRoutes = {
  ROOT,
  DASHBOARD
}

export const REDIRECT_QUERY_KEY = 'redirect'
export const DEFAULT_ROUTER = DASHBOARD

export default ROUTES
