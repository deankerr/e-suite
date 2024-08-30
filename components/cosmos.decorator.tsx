export default function CosmosDecorator({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed h-full w-full bg-grid-gray2" />
      {children}
    </>
  )
}
