import CoinLoader from '../CoinLoader/CoinLoader'
import './FullPageLoader.css'

const FullPageLoader = ({ label = 'Loading...' }) => {
	return (
		<div className="full-page-loader" role="status" aria-live="polite" aria-busy="true">
			<div className="full-page-loader-card">
				<CoinLoader label={label} />
			</div>
		</div>
	)
}

export default FullPageLoader