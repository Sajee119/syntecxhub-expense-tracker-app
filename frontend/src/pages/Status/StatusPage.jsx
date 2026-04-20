import '../../pages/InfoPage.css'

const StatusPage = () => {
	return (
		<main className="info-page">
			<div className="info-page__container">
				<section className="info-page__hero">
					<div className="info-page__eyebrow">
						<i className="fa-solid fa-circle-check" aria-hidden="true" /> Status
					</div>
					<h1 className="info-page__title">System Status</h1>
					<p className="info-page__subtitle">Track service health for the app, API, and database connectivity.</p>
				</section>

				<div className="info-page__grid">
					<div className="info-card">
						<h3>Web App</h3>
						<p>Operational</p>
					</div>
					<div className="info-card">
						<h3>API</h3>
						<p>Operational</p>
					</div>
					<div className="info-card">
						<h3>Database</h3>
						<p>Operational</p>
					</div>
				</div>
			</div>
		</main>
	)
}

export default StatusPage