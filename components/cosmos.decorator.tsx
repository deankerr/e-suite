const Decorator = ({ children }: { children: React.ReactNode }) => (
  <div className="dark:bg-grid-dark h-screen">{children}</div>
)

export default Decorator
