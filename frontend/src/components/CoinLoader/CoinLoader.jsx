import './CoinLoader.css'

const CoinLoader = ({ label = 'Loading...' }) => {
	return (
		<div className="coin-loader-wrap" role="status" aria-live="polite">
			<span className="coin-loader" />
			<span>{label}</span>
		</div>
	)
}

export default CoinLoader