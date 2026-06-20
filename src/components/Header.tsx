interface HeaderProps {
  onRestore: () => void
}

export function Header({ onRestore }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-logo">PC</div>
        <div>
          <p className="brand-kicker">PC Games</p>
          <h1>PC Games Tandang Sora</h1>
        </div>
      </div>
      <button className="ghost-button" onClick={onRestore} type="button">
        Restore Build
      </button>
    </header>
  )
}
