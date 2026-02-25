import { createFileRoute } from '@tanstack/react-router'
import { getLanguageFromPath } from '@/utils/multilingualRoutes'
import { buildPageHead } from '@/utils/seo'

export const Route = createFileRoute('/resources')({
  head: (ctx) => {
    const pathname = ((ctx as unknown as { location?: { pathname?: string } })?.location?.pathname) || '/'
    const lang = getLanguageFromPath(pathname)
    return buildPageHead('/resources', lang)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/resources"!</div>
}
