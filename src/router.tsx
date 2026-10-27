import { HashRouter, Navigate, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import ExplorePage from "./pages/ExplorePage"
import { ExploreDataProvider } from "./lib/explore/data"

const ComponentsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ComponentsPage"))
  : null

const ChartsPage = import.meta.env.DEV
  ? lazy(() => import("./pages/dev/ChartsPage"))
  : null

const Loading = () => <div className="p-8 text-muted-foreground">加载中...</div>

export default function Router() {
  return (
    <HashRouter>
      <ExploreDataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="/items" element={<ExplorePage />} />
          <Route path="/items/:id" element={<ExplorePage />} />
          <Route path="/weekly" element={<ExplorePage />} />
          <Route path="/weekly/:id" element={<ExplorePage />} />
          <Route path="*" element={<Navigate to="/items" replace />} />

          {import.meta.env.DEV && ComponentsPage && (
            <Route path="/dev/components" element={<Suspense fallback={<Loading />}><ComponentsPage /></Suspense>} />
          )}
          {import.meta.env.DEV && ChartsPage && (
            <Route path="/dev/charts" element={<Suspense fallback={<Loading />}><ChartsPage /></Suspense>} />
          )}
        </Routes>
      </ExploreDataProvider>
    </HashRouter>
  )
}
