interface HeaderProps {
  onRestore: () => void
  onThemeToggle: () => void
  theme: 'light' | 'dark'
}

export function Header({ onRestore, onThemeToggle, theme }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="brand">
        <img
          alt="PC Games Services"
          className="header-logo"
          src="/images/pc-games-services-header-logo.png"
        />
      </div>
      <div className="header-actions">
        <button
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          className="theme-toggle"
          onClick={onThemeToggle}
          title={theme === 'light' ? 'Dark theme' : 'Light theme'}
          type="button"
        >
          {theme === 'light' ? (
            <svg
              aria-hidden="true"
              className="theme-toggle__icon"
              viewBox="0 0 24 24"
            >
              <path d="M20.3 14.9A8.2 8.2 0 0 1 9.1 3.7 8.9 8.9 0 1 0 20.3 14.9Z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="theme-toggle__icon"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4.4" />
              <path d="M12 2.4v2.1M12 19.5v2.1M4.5 4.5 6 6M18 18l1.5 1.5M2.4 12h2.1M19.5 12h2.1M4.5 19.5 6 18M18 6l1.5-1.5" />
            </svg>
          )}
        </button>
        <button className="ghost-button" onClick={onRestore} type="button">
          Restore Build
        </button>
      </div>
    </header>
  )
}
