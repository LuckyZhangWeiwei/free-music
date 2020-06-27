import React, { lazy, Suspense } from "react"

const withSuspense = Component => {
  return props => (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  )
}

const Recommend = withSuspense(lazy(() => import("../components/recommend")))
const Rank = withSuspense(lazy(() => import("../components/rank")))
const Singer = withSuspense(lazy(() => import("../components/singer")))
const Search = withSuspense(lazy(() => import("../components/search")))
const UserCenter = withSuspense(lazy(() => import("../components/user-center")))

const router = [
  {
    path: "/recommend",
    component: Recommend
  },{
		path: "/rank",
    component: Rank
	},{
		path: "/singer",
    component: Singer
	},
	{
		path: "/search",
    component: Search
	},
	{
		path: "/user",
    component: UserCenter
	}
]

export default router