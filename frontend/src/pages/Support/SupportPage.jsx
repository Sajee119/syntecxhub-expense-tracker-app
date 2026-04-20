import '../../pages/InfoPage.css'

const SupportPage = () => {
	return (
		<main className="info-page">
			<div className="info-page__container">
				<section className="info-page__hero">
					<div className="info-page__eyebrow">
						<i className="fa-solid fa-headset" aria-hidden="true" /> Support
					</div>
					<h1 className="info-page__title">Support Center</h1>
					<p className="info-page__subtitle">Need help with login, expenses, budgets, or theme settings? Use the contact options below.</p>
				</section>

				<div className="info-page__content">
					<section className="info-section">
						<h2>Contact options</h2>
						<ul className="info-list">
							<li>Email: Sajeepan634@gmail.com</li>
							<li>Phone: +94783566823</li>
							<li>Response time: within 1 business day</li>
						</ul>
					</section>

					<section className="info-section">
						<h2>Common help topics</h2>
						<ul className="info-list">
							<li>How to add or edit an expense</li>
							<li>How to set a monthly budget or category budget</li>
							<li>How to switch between dark and light mode</li>
						</ul>
					</section>
				</div>
			</div>
		</main>
	)
}

export default SupportPage