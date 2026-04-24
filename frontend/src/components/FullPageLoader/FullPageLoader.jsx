import './FullPageLoader.css'

const FullPageLoader = ({ label = 'Loading...' }) => {
	return (
		<div className="full-page-loader" role="status" aria-live="polite" aria-busy="true">
			<div className="full-page-loader-card">
				<div className="wave-loader" aria-hidden="true">
					<span className="wave-bar" />
					<span className="wave-bar" />
					<span className="wave-bar" />
					<span className="wave-bar" />
					<span className="wave-bar" />
				</div>
				<p className="full-page-loader-label">{label}</p>
			</div>
		</div>
	)
}

export default FullPageLoader