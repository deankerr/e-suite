import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/chat/:slug',
    '/generate/:slug',
    '/m',
    '/m/:slug',
    '/t',
    '/t/:slug',
    '/debug',
    '/debug/fonts',
  ],
  ignoredRoutes: ['/icon'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
