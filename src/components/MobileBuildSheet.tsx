import type { DriveOption, Game } from '../types'
import { BuildSidebar } from './BuildSidebar'

interface MobileBuildSheetProps {
  drive: DriveOption
  isOpen: boolean
  remainingGB: number
  selectedGames: Game[]
  usedGB: number
  onChangeDrive: () => void
  onCheckout: () => void
  onClear: () => void
  onClose: () => void
  onOpen: () => void
  onRemoveGame: (gameId: string) => void
}

export function MobileBuildSheet({
  drive,
  isOpen,
  remainingGB,
  selectedGames,
  usedGB,
  onChangeDrive,
  onCheckout,
  onClear,
  onClose,
  onOpen,
  onRemoveGame,
}: MobileBuildSheetProps) {
  return (
    <>
      <div className="mobile-build-bar">
        <strong>{drive.label}</strong>
        <span>{selectedGames.length} games</span>
        <span>{remainingGB.toFixed(0)}GB left</span>
        <button onClick={onOpen} type="button">
          View Build
        </button>
      </div>
      {isOpen && (
        <div className="modal-backdrop">
          <section className="bottom-sheet" aria-modal="true" role="dialog">
            <button className="sheet-close" onClick={onClose} type="button">
              Close
            </button>
            <BuildSidebar
              drive={drive}
              remainingGB={remainingGB}
              selectedGames={selectedGames}
              usedGB={usedGB}
              onChangeDrive={onChangeDrive}
              onCheckout={onCheckout}
              onClear={onClear}
              onRemoveGame={onRemoveGame}
            />
          </section>
        </div>
      )}
    </>
  )
}
