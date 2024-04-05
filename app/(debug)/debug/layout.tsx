export default async function DebugAppLayout({ children }: { children: React.ReactNode }) {
  // const token = await getAuthToken()

  return <div className="flex h-full overflow-hidden">{children}</div>
}
