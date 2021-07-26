import React, { lazy, Suspense } from "react";

const withSuspense = (Component) => {
  return (props) => (
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  );
};

const Recommend = withSuspense(lazy(() => import("../components/recommend")));
const Rank = withSuspense(lazy(() => import("../components/rank")));
const Singer = withSuspense(lazy(() => import("../components/singer")));
const Search = withSuspense(lazy(() => import("../components/search")));
const UserCenter = withSuspense(
  lazy(() => import("../components/user-center"))
);
const SingerDetail = withSuspense(
  lazy(() => import("../components/singer-detail"))
);
const Disc = withSuspense(lazy(() => import("../components/disc")));
const TopList = withSuspense(lazy(() => import("../components/top-list")));

const router = [
  {
    path: "/recommend",
    component: Recommend,
    routes: [
      {
        path: "/recommend/:id",
        component: Disc,
      },
    ],
  },
  {
    path: "/rank",
    component: Rank,
    routes: [
      {
        path: "/rank/:id",
        component: TopList,
      },
    ],
  },
  {
    path: "/singer",
    component: Singer,
    routes: [
      {
        path: "/singer/:id",
        component: SingerDetail,
      },
    ],
  },
  {
    path: "/search",
    component: Search,
    routes: [
      {
        path: "/search/:id",
        component: SingerDetail,
      },
    ],
  },
  {
    path: "/user",
    component: UserCenter,
  },
];

export default router;
