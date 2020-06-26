import React, { lazy, Suspense } from "react"

const withSuspense = Component => {
  return props => (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  )
}

const Recommend = withSuspense(lazy(() => import("../components/recommend")))

const router = [
  {
    path: "/recommend",
    component: Recommend
  }
]

export default router