import type { DriveOption, Game } from '../types'
import { formatPeso } from '../utils/format'

interface BuildSidebarProps {
  drive: DriveOption
  selectedGames: Game[]
  usedGB: number
  remainingGB: number
  onChangeDrive: () => void
  onCheckout: () => void
  onClear: () => void
  onRemoveGame: (gameId: string) => void
}

export function BuildSidebar({
  drive,
  selectedGames,
  usedGB,
  remainingGB,
  onChangeDrive,
  onCheckout,
  onClear,
  onRemoveGame,
}: BuildSidebarProps) {
  const usagePercent = Math.min(100, (usedGB / drive.usableGB) * 100)

  return (
    <aside className="build-panel">
      <div className="panel-heading">
        <p className="eyebrow">Your package</p>
        <h2>YOUR BUILD</h2>
      </div>
      <div className="drive-summary">
        <div>
          <span>Selected Drive</span>
          <strong>{drive.label}</strong>
        </div>
        <button className="text-button" onClick={onChangeDrive} type="button">
          Change Drive
        </button>
      </div>
      <div className="storage-meter">
        <div className="storage-meter__numbers">
          <span>{usedGB.toFixed(1)}GB used</span>
          <span>{remainingGB.toFixed(1)}GB left</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${usagePercent}%` }} />
        </div>
      </div>
      <div className="summary-stats">
        <div>
          <span>Games</span>
          <strong>{selectedGames.length}</strong>
        </div>
        <div>
          <span>Package</span>
          <strong>{formatPeso(drive.price)}</strong>
        </div>
      </div>
      <div className="selected-list">
        {selectedGames.length === 0 ? (
          <p className="empty-state">No games added.</p>
        ) : (
          selectedGames.map((game) => (
            <div className="selected-item" key={game.id}>
              <div>
                <strong>{game.title}</strong>
                <span>{game.sizeGB.toFixed(1)}GB</span>
              </div>
              <button onClick={() => onRemoveGame(game.id)} type="button">
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="panel-actions">
        <button
          className="secondary-action"
          disabled={selectedGames.length === 0}
          onClick={onClear}
          type="button"
        >
          Clear Build
        </button>
        <button
          className="primary-action"
          disabled={selectedGames.length === 0}
          onClick={onCheckout}
          type="button"
        >
          Checkout
        </button>
      </div>
    </aside>
  )
}
