import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BuildSidebar } from './components/BuildSidebar'
import { CheckoutModal } from './components/CheckoutModal'
import { DriveModal } from './components/DriveModal'
import { Filters } from './components/Filters'
import { GameCard } from './components/GameCard'
import { Header } from './components/Header'
import { MobileBuildSheet } from './components/MobileBuildSheet'
import { NewReleases } from './components/NewReleases'
import { drives } from './data/drives'
import { games } from './data/games'
import type { BuildSnapshot, Game, GameCategory, SortOption, SpecLevel } from './types'

const storageKey = 'pcg-builder-snapshot'
const pageSize = 56

const categories: Array<GameCategory | 'All Games' | 'New Releases'> = [
  'All Games',
  '2 Players / Co-op',
  'Action / Adventure',
  'FPS / Shooting',
  'Fighting / Anime',
  'Horror / Survival',
  'Open World',
  'RPG / JRPG',
  'Racing',
  'Sports',
  'Strategy / Simulation',
  'New Releases',
]

const loadSnapshot = (): BuildSnapshot => {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) {
      return { driveId: null, selectedGameIds: [] }
    }

    const parsed = JSON.parse(saved) as Partial<BuildSnapshot>
    return {
      driveId: parsed.driveId ?? null,
      selectedGameIds: Array.isArray(parsed.selectedGameIds)
        ? parsed.selectedGameIds
        : [],
    }
  } catch {
    return { driveId: null, selectedGameIds: [] }
  }
}

const getFittingGameIds = (gameIds: string[], driveId: string | null) => {
  const drive = drives.find((option) => option.id === driveId)
  if (!drive) return []

  let openSpace = drive.usableGB
  const fittingGameIds: string[] = []

  gameIds.forEach((gameId) => {
    const game = games.find((item) => item.id === gameId)
    if (!game || game.sizeGB > openSpace) {
      return
    }

    fittingGameIds.push(game.id)
    openSpace -= game.sizeGB
  })

  return fittingGameIds
}

function App() {
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(() => {
    const saved = loadSnapshot()
    return drives.some((drive) => drive.id === saved.driveId) ? saved.driveId : null
  })
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(() => {
    const saved = loadSnapshot()
    const driveId = drives.some((drive) => drive.id === saved.driveId)
      ? saved.driveId
      : null

    return getFittingGameIds(saved.selectedGameIds, driveId)
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpec, setSelectedSpec] = useState<SpecLevel | 'All Specs'>(
    'All Specs',
  )
  const [selectedCategory, setSelectedCategory] = useState<
    GameCategory | 'All Games' | 'New Releases'
  >('All Games')
  const [sortOption, setSortOption] = useState<SortOption>('A-Z')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectAllMessage, setSelectAllMessage] = useState('')
  const [showDriveModal, setShowDriveModal] = useState(!selectedDriveId)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showMobileBuild, setShowMobileBuild] = useState(false)

  const selectedDrive = useMemo(
    () => drives.find((drive) => drive.id === selectedDriveId) ?? null,
    [selectedDriveId],
  )

  const selectedGames = useMemo(
    () => games.filter((game) => selectedGameIds.includes(game.id)),
    [selectedGameIds],
  )

  const usedGB = useMemo(
    () => selectedGames.reduce((total, game) => total + game.sizeGB, 0),
    [selectedGames],
  )
  const remainingGB = selectedDrive ? selectedDrive.usableGB - usedGB : 0

  useEffect(() => {
    const snapshot: BuildSnapshot = { driveId: selectedDriveId, selectedGameIds }
    window.localStorage.setItem(storageKey, JSON.stringify(snapshot))
  }, [selectedDriveId, selectedGameIds])

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return games
      .filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(normalizedSearch)
        const matchesSpec =
          selectedSpec === 'All Specs' || game.specLevel === selectedSpec
        const matchesCategory =
          selectedCategory === 'All Games' ||
          (selectedCategory === 'New Releases' && game.isNew) ||
          game.category === selectedCategory

        return matchesSearch && matchesSpec && matchesCategory
      })
      .sort((a, b) => {
        if (sortOption === 'Z-A') return b.title.localeCompare(a.title)
        if (sortOption === 'Size Smallest') return a.sizeGB - b.sizeGB
        if (sortOption === 'Size Largest') return b.sizeGB - a.sizeGB
        if (sortOption === 'Newest First') return Number(b.isNew) - Number(a.isNew)
        return a.title.localeCompare(b.title)
      })
  }, [searchTerm, selectedCategory, selectedSpec, sortOption])

  const selectedIdSet = useMemo(() => new Set(selectedGameIds), [selectedGameIds])
  const selectedFilteredCount = filteredGames.filter((game) =>
    selectedIdSet.has(game.id),
  ).length

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visibleGames = filteredGames.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  const updateSearchTerm = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    setSelectAllMessage('')
  }

  const updateSelectedSpec = (spec: SpecLevel | 'All Specs') => {
    setSelectedSpec(spec)
    setCurrentPage(1)
    setSelectAllMessage('')
  }

  const updateSelectedCategory = (
    category: GameCategory | 'All Games' | 'New Releases',
  ) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSelectAllMessage('')
  }

  const updateSortOption = (option: SortOption) => {
    setSortOption(option)
    setCurrentPage(1)
    setSelectAllMessage('')
  }

  const canAdd = (game: Game) => {
    if (!selectedDrive) return false
    return selectedGameIds.includes(game.id) || game.sizeGB <= remainingGB
  }

  const toggleGame = (game: Game) => {
    if (!selectedDrive) {
      setShowDriveModal(true)
      return
    }

    setSelectedGameIds((current) => {
      if (current.includes(game.id)) {
        return current.filter((gameId) => gameId !== game.id)
      }

      const currentUsedGB = current.reduce((total, gameId) => {
        const selectedGame = games.find((item) => item.id === gameId)
        return selectedGame ? total + selectedGame.sizeGB : total
      }, 0)
      const currentRemainingGB = selectedDrive.usableGB - currentUsedGB

      if (game.sizeGB > currentRemainingGB) {
        return current
      }

      return [...current, game.id]
    })
  }

  const removeGame = (gameId: string) => {
    setSelectedGameIds((current) => current.filter((id) => id !== gameId))
  }

  const chooseDrive = (driveId: string) => {
    const drive = drives.find((option) => option.id === driveId)
    if (!drive) return

    setSelectedDriveId(driveId)
    setSelectedGameIds(getFittingGameIds(selectedGameIds, driveId))
    setShowDriveModal(false)
  }

  const restoreBuild = () => {
    const saved = loadSnapshot()
    const driveId = drives.some((drive) => drive.id === saved.driveId)
      ? saved.driveId
      : null

    setSelectedDriveId(driveId)
    setSelectedGameIds(getFittingGameIds(saved.selectedGameIds, driveId))
    setShowDriveModal(!driveId)
  }

  const clearBuild = () => {
    setSelectedGameIds([])
    setSelectAllMessage('')
  }

  const selectAllThatFit = () => {
    if (!selectedDrive) {
      setShowDriveModal(true)
      return
    }

    const nextSelectedIds = new Set(selectedGameIds)
    let openSpace = remainingGB
    let addedCount = 0

    filteredGames.forEach((game) => {
      if (nextSelectedIds.has(game.id)) {
        return
      }

      if (game.sizeGB <= openSpace) {
        nextSelectedIds.add(game.id)
        openSpace -= game.sizeGB
        addedCount += 1
      }
    })

    const nextSelectedGameIds = [...nextSelectedIds]
    setSelectedGameIds(nextSelectedGameIds)
    setSelectAllMessage(
      `${nextSelectedGameIds.length} total selected (${addedCount} added from this view).`,
    )
  }

  return (
    <>
      <Header onRestore={restoreBuild} />
      <main className={showDriveModal ? 'app-shell app-shell--dimmed' : 'app-shell'}>
        <section className="intro-panel">
          <p className="eyebrow">Tandang Sora, Quezon City</p>
          <h2>Build your PC game drive online.</h2>
          <p>
            Choose your storage, pick your games, then send your order through
            Messenger. Located in Tandang Sora, Quezon City. Pickup and delivery
            available.
          </p>
        </section>

        <Filters
          categories={categories}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedSpec={selectedSpec}
          sortOption={sortOption}
          onCategoryChange={updateSelectedCategory}
          onSearchChange={updateSearchTerm}
          onSortChange={updateSortOption}
          onSpecChange={updateSelectedSpec}
        />

        <div className="content-grid">
          <div className="catalog-column">
            <NewReleases
              canAdd={canAdd}
              games={games.filter((game) => game.isNew).slice(0, 10)}
              selectedIds={selectedIdSet}
              onToggle={toggleGame}
            />

            <section className="catalog-section">
              <div className="catalog-toolbar">
                <div>
                  <p className="eyebrow">
                    {filteredGames.length} games - Page {safeCurrentPage} of{' '}
                    {totalPages}
                  </p>
                  <h2>Main Catalog</h2>
                </div>
                <button
                  className="ghost-button"
                  onClick={selectAllThatFit}
                  type="button"
                >
                  Select All That Fit ({selectedFilteredCount}/{filteredGames.length})
                </button>
              </div>
              <div className="catalog-selection-status">
                <span>{selectedGameIds.length} total games selected</span>
                {selectAllMessage && <strong>{selectAllMessage}</strong>}
              </div>
              <div className="game-grid">
                {visibleGames.map((game) => (
                  <GameCard
                    canAdd={canAdd(game)}
                    game={game}
                    isSelected={selectedIdSet.has(game.id)}
                    key={game.id}
                    onToggle={toggleGame}
                  />
                ))}
              </div>
              <nav className="pagination" aria-label="Catalog pagination">
                <button
                  className="page-button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  type="button"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      className={`page-button ${
                        safeCurrentPage === page ? 'is-active' : ''
                      }`}
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      type="button"
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  className="page-button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  type="button"
                >
                  Next
                </button>
              </nav>
            </section>
          </div>

          {selectedDrive && (
            <BuildSidebar
              drive={selectedDrive}
              remainingGB={remainingGB}
              selectedGames={selectedGames}
              usedGB={usedGB}
              onChangeDrive={() => setShowDriveModal(true)}
              onCheckout={() => setShowCheckout(true)}
              onClear={clearBuild}
              onRemoveGame={removeGame}
            />
          )}
        </div>
      </main>

      {showDriveModal && (
        <DriveModal
          drives={drives}
          selectedDriveId={selectedDriveId}
          onChoose={chooseDrive}
        />
      )}

      {selectedDrive && (
        <MobileBuildSheet
          drive={selectedDrive}
          isOpen={showMobileBuild}
          remainingGB={remainingGB}
          selectedGames={selectedGames}
          usedGB={usedGB}
          onChangeDrive={() => {
            setShowMobileBuild(false)
            setShowDriveModal(true)
          }}
          onCheckout={() => setShowCheckout(true)}
          onClear={clearBuild}
          onClose={() => setShowMobileBuild(false)}
          onOpen={() => setShowMobileBuild(true)}
          onRemoveGame={removeGame}
        />
      )}

      {showCheckout && selectedDrive && (
        <CheckoutModal
          drive={selectedDrive}
          selectedGames={selectedGames}
          usedGB={usedGB}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  )
}

export default App
