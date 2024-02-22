/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/login')()
const IndexLazyImport = createFileRoute('/')()
const ProjectIndexLazyImport = createFileRoute('/project/')()
const ProjectCreateLazyImport = createFileRoute('/project/create')()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ProjectIndexLazyRoute = ProjectIndexLazyImport.update({
  path: '/project/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/project/index.lazy').then((d) => d.Route))

const ProjectCreateLazyRoute = ProjectCreateLazyImport.update({
  path: '/project/create',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/project/create.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/project/create': {
      preLoaderRoute: typeof ProjectCreateLazyImport
      parentRoute: typeof rootRoute
    }
    '/project/': {
      preLoaderRoute: typeof ProjectIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  LoginLazyRoute,
  ProjectCreateLazyRoute,
  ProjectIndexLazyRoute,
])

/* prettier-ignore-end */
