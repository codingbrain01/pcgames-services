interface HeaderProps {
  onRestore: () => void
}

export function Header({ onRestore }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand">
        <img
          alt="PC Games Services"
          className="header-logo"
          src="/images/pc-games-services-header-logo.png"
        />
      </div>
      <button className="ghost-button" onClick={onRestore} type="button">
        Restore & Build
      </button>
    </header>
  )
}
