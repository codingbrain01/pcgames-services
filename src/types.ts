export type SpecLevel = 'Light' | 'Medium' | 'High'

export type GameCategory =
  | '2 Players / Co-op'
  | 'Action / Adventure'
  | 'FPS / Shooting'
  | 'Fighting / Anime'
  | 'Horror / Survival'
  | 'Open World'
  | 'RPG / JRPG'
  | 'Racing'
  | 'Sports'
  | 'Strategy / Simulation'

export type SortOption =
  | 'A-Z'
  | 'Z-A'
  | 'Size Smallest'
  | 'Size Largest'
  | 'Newest First'

export interface DriveOption {
  id: string
  label: string
  usableGB: number
  price: number
  badge?: 'sale' | 'mega sale'
}

export interface Game {
  id: string
  title: string
  sizeGB: number
  specLevel: SpecLevel
  category: GameCategory
  isNew: boolean
  coverUrl: string
}

export interface BuildSnapshot {
  driveId: string | null
  selectedGameIds: string[]
}
