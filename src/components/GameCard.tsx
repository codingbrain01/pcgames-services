import type { Game } from '../types'

interface GameCardProps {
  game: Game
  isSelected: boolean
  canAdd: boolean
  compact?: boolean
  onToggle: (game: Game) => void
}

export function GameCard({
  game,
  isSelected,
  canAdd,
  compact = false,
  onToggle,
}: GameCardProps) {
  const blocked = !isSelected && !canAdd

  return (
    <article className={`game-card ${compact ? 'game-card--compact' : ''}`}>
      <div className="poster-wrap">
        {game.isNew && <span className="new-badge">NEW</span>}
        <img alt={`${game.title} cover`} src={game.coverUrl} />
      </div>
      <div className="game-card__body">
        <h3>{game.title}</h3>
        <div className="game-meta">
          <span>{game.sizeGB.toFixed(1)}GB</span>
          <span className={`spec-pill spec-pill--${game.specLevel.toLowerCase()}`}>
            {game.specLevel}
          </span>
        </div>
        <button
          className={`add-button ${isSelected ? 'is-selected' : ''}`}
          disabled={blocked}
          onClick={() => onToggle(game)}
          type="button"
        >
          {blocked ? 'Not enough space.' : isSelected ? 'Added' : '+ ADD'}
        </button>
      </div>
    </article>
  )
}
