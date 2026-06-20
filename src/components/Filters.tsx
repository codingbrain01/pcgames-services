import type { GameCategory, SortOption, SpecLevel } from '../types'

interface FiltersProps {
  categories: Array<GameCategory | 'All Games' | 'New Releases'>
  selectedCategory: GameCategory | 'All Games' | 'New Releases'
  selectedSpec: SpecLevel | 'All Specs'
  searchTerm: string
  sortOption: SortOption
  onCategoryChange: (category: GameCategory | 'All Games' | 'New Releases') => void
  onSearchChange: (value: string) => void
  onSortChange: (value: SortOption) => void
  onSpecChange: (spec: SpecLevel | 'All Specs') => void
}

const specs: Array<SpecLevel | 'All Specs'> = ['All Specs', 'Light', 'Medium', 'High']
const sorts: SortOption[] = ['A-Z', 'Z-A', 'Size Smallest', 'Size Largest', 'Newest First']

export function Filters({
  categories,
  selectedCategory,
  selectedSpec,
  searchTerm,
  sortOption,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSpecChange,
}: FiltersProps) {
  return (
    <section className="filters" aria-label="Game filters">
      <label className="search-box">
        <span>Search</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search games…"
          type="search"
          value={searchTerm}
        />
      </label>
      <div className="filter-row">
        {specs.map((spec) => (
          <button
            className={`chip chip--${spec.toLowerCase().replace(' ', '-')} ${
              selectedSpec === spec ? 'is-active' : ''
            }`}
            key={spec}
            onClick={() => onSpecChange(spec)}
            type="button"
          >
            {spec}
          </button>
        ))}
      </div>
      <div className="filter-row filter-row--categories">
        {categories.map((category) => (
          <button
            className={`chip ${selectedCategory === category ? 'is-active' : ''}`}
            key={category}
            onClick={() => onCategoryChange(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
      <label className="sort-box">
        <span>Sort</span>
        <select
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          value={sortOption}
        >
          {sorts.map((sort) => (
            <option key={sort} value={sort}>
              {sort}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
