import type { Game } from '../types'
import { GameCard } from './GameCard'

interface NewReleasesProps {
  games: Game[]
  selectedIds: Set<string>
  canAdd: (game: Game) => boolean
  onToggle: (game: Game) => void
}

export function NewReleases({
  games,
  selectedIds,
  canAdd,
  onToggle,
}: NewReleasesProps) {
  return (
    <section className="new-releases">
      <div className="section-heading">
        <p className="eyebrow">Fresh picks</p>
        <h2>NEW RELEASES</h2>
      </div>
      <div className="release-strip">
        {games.map((game) => (
          <GameCard
            canAdd={canAdd(game)}
            compact
            game={game}
            isSelected={selectedIds.has(game.id)}
            key={game.id}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}
