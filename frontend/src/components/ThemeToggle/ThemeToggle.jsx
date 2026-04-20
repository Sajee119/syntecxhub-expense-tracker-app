import './ThemeToggle.css'

const ThemeToggle = ({ theme, onToggle, disabled }) => {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      disabled={disabled}
    >
        <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`} />
      
    </button>
  )
}

export default ThemeToggle
