import Navbar from '../../components/Navbar/Navbar'
import developerProfile from '../../assets/sajee-profile.png'
import './AboutPage.css'

const AboutPage = () => {
	return (
		<main className="about-page">
			<div className="about-page__container">
				<section className="about-page__section about-page__intro">
					<div className="about-page__intro-content">
						<h1 className="about-page__title">
							<span className="about-page__title-icon"><i className="fa-solid fa-chart-line" aria-hidden="true"></i></span>
							About MyExpense
						</h1>
						<p className="about-page__subtitle">Your Personal Expense Tracking Companion</p>
						<p className="about-page__description">
							MyExpense is a modern, intuitive expense tracking application designed to help you manage your finances effortlessly. 
							Track every expense, analyze spending patterns, and make informed financial decisions with our comprehensive dashboard and advanced analytics.
						</p>
					</div>
				</section>
				<section className="about-page__section">
					<h2 className="about-page__section-title">
						<span className="about-page__section-icon"><i className="fa-solid fa-globe" aria-hidden="true"></i></span> Features
					</h2>
					<div className="about-page__features-grid">
						<div className="about-page__feature-card">
							<span className="about-page__feature-icon"><i className="fa-solid fa-chart-bar" aria-hidden="true"></i></span>
							<h3>Interactive Dashboard</h3>
							<p>Real-time insights with KPI metrics, spending trends, and top expense categories at a glance.</p>
						</div>
						<div className="about-page__feature-card">
							<span className="about-page__feature-icon"><i className="fa-solid fa-money-bill-wave" aria-hidden="true"></i></span>
							<h3>Track Expenses</h3>
							<p>Easily add, edit, and delete expenses with description, amount, and date tracking.</p>
						</div>
						<div className="about-page__feature-card">
							<span className="about-page__feature-icon"><i className="fa-solid fa-chart-line" aria-hidden="true"></i></span>
							<h3>Advanced History</h3>
							<p>Filter, search, and sort your expenses by month, amount, and description with detailed analytics.</p>
						</div>
						<div className="about-page__feature-card">
							<span className="about-page__feature-icon"><i className="fa-solid fa-shield-halved" aria-hidden="true"></i></span>
							<h3>Secure Account</h3>
							<p>Password-protected account with encrypted data storage and session management.</p>
						</div>
					</div>
				</section>
				<section className="about-page__section">
					<h2 className="about-page__section-title">
						<span className="about-page__section-icon"><i className="fa-solid fa-code" aria-hidden="true"></i></span> Developer
					</h2>
					<div className="about-page-developer">
						<div className="about-page-developer-img">
							<img src={developerProfile} alt="Sivanadarajah Sajeepan - Developer Profile" />
						</div>
						<div className="about-page-developer-info">
							<h3 className="about-page-developer-name">Sivanadarajah Sajeepan</h3>
							<p className="about-page-developer-title">Software Engineer</p>
							<p className="about-page-developer-role">Full Stack Developer</p>
							<p className="about-page-developer-bio">
								Sajeepan is a passionate full stack developer with expertise in building modern web applications. 
								With a strong background in JavaScript, React, and Node.js, Sajeepan is dedicated to creating seamless 
								user experiences and efficient code. When not coding, Sajeepan enjoys hiking and exploring new technologies.
							</p>
							<div className="about-page-developer-contact">
								<p><span className="contact-icon"><i className="fa-solid fa-envelope" aria-hidden="true"></i></span> Sajeepan634@gmail.com</p>
								<p><span className="contact-icon"><i className="fa-solid fa-phone" aria-hidden="true"></i></span> +94783566823 </p>
							</div>
							<div className="about-page-developer-links">
								<a 
									href="https://www.linkedin.com/in/sivanadaraja-sajeepan/"
									target="_blank"
									rel="noopener noreferrer"
									className="about-page-developer-link about-page-developer-link--linkedin"
								>
									<span><i className="fa-brands fa-linkedin" aria-hidden="true"></i></span> LinkedIn
								</a>
								<a 
									href="https://github.com/Sajee119" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="about-page-developer-link about-page-developer-link--github"
								>
									<span><i className="fa-brands fa-github" aria-hidden="true"></i></span> GitHub
								</a>
								<a 
									href="https://x.com/SSajeepan3492" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="about-page-developer-link about-page-developer-link--twitter"
								>
									<span><i className="fa-brands fa-x-twitter" aria-hidden="true"></i></span> X
								</a>
								<a 
									href="mailto:Sajeepan634@gmail.com" 
									className="about-page-developer-link about-page-developer-link--email"
								>
									<span><i className="fa-solid fa-envelope" aria-hidden="true"></i></span> Email
								</a>
								<a 
									href="https://sajeepan-portfolio.vercel.app/" 
									target="_blank" 
									rel="noopener noreferrer" 
									className="about-page-developer-link about-page-developer-link--portfolio"
								>
									<span><i className="fa-solid fa-briefcase" aria-hidden="true"></i></span> Portfolio
								</a>
							</div>
						</div>
					</div>
				</section>
				<section className="about-page__section about-page__footer-section">
					<h2 className="about-page__section-title">
						<span className="about-page__section-icon"><i className="fa-solid fa-circle-info" aria-hidden="true"></i></span> About This Project
					</h2>
					<div className="about-page__creator-card">
						<p className="about-page__creator-name">MyExpense</p>
						<p className="about-page__creator-description">
							A modern expense tracking application built by passionate developers. 
							This project was created to provide a 
							comprehensive solution for personal finance management.
						</p>
						<div className="about-page__project-info">
							<p><strong>Version:</strong> 1.0.0</p>
							<p><strong>Release Date:</strong> April 2026</p>
							<p><strong>License:</strong> MIT</p>
							<p><strong>Tech Stack:</strong> React, Node.js, MongoDB, Express</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

export default AboutPage
