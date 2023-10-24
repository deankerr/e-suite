type Props = {
  children: React.ReactNode
}

export default function ChatLayout({ children }: Props) {
  return (
    <div>
      <div>ChatLayout</div>
      <div>{children}</div>
    </div>
  )
}
