import './CoinLoader.css'

const CoinLoader = ({ 
  label = 'Loading...', 
  size = 'medium',  // 'small', 'medium', 'large'
  inline = false 
}) => {
  const sizeClass = size === 'medium' ? '' : size
  const inlineClass = inline ? 'inline' : ''
  
  return (
    <div 
      className={`coin-loader-wrap ${sizeClass} ${inlineClass}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="coin-loader" />
      <span>{label}</span>
    </div>
  )
}

export default CoinLoader