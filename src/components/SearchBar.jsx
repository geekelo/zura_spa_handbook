import { Icon } from './Icons'
import './SearchBar.css'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search the handbook...',
}) {
  return (
    <label className="search-bar">
      <Icon name="search" size={18} className="search-bar__icon" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search the handbook"
        enterKeyHint="search"
      />
    </label>
  )
}
