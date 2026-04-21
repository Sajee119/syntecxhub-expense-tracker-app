import { Link } from 'react-router-dom'
import './Home.css'

const Home = ({ isAuthenticated, user }) => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      text: 'This expense tracker has completely changed how I manage my finances. So simple yet powerful!'
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      text: 'The dashboard gives me instant insights into my spending. Highly recommended!'
    },
    {
      name: 'Emma Williams',
      role: 'Financial Coach',
      text: 'I recommend this to all my clients. Clean interface and great analytics features.'
    }
  ]

  const features = [
    {
      icon: 'fa-solid fa-chart-pie',
      title: 'Smart Analytics',
      description: 'Visualize your spending with interactive charts and get actionable insights.'
    },
    {
      icon: 'fa-solid fa-bell',
      title: 'Budget Alerts',
      description: 'Get notified when you are close to exceeding your monthly budget limits.'
    },
    {
      icon: 'fa-solid fa-cloud-arrow-up',
      title: 'Cloud Sync',
      description: 'Access your expenses from anywhere with secure cloud storage.'
    },
    {
      icon: 'fa-solid fa-mobile-alt',
      title: 'Mobile Responsive',
      description: 'Track expenses on the go with our fully responsive design.'
    },
    {
      icon: 'fa-solid fa-shield',
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security.'
    },
    {
      icon: 'fa-solid fa-file-export',
      title: 'Export Data',
      description: 'Download your expense history as CSV for further analysis.'
    }
  ]

  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-eyebrow">
          <i className="fa-solid fa-chart-line" aria-hidden="true" /> Track Smart. Spend Better.
        </p>
        <h1>Personal expense tracking that is simple and fast.</h1>
        <p>
          Manage daily spending, understand your habits, and build financial discipline with one
          clean dashboard.
        </p>
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-number">10+</span>
            <span className="home-stat-label">Active Users</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-number">50+</span>
            <span className="home-stat-label">Expenses Tracked</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-number">99.9%</span>
            <span className="home-stat-label">Uptime</span>
          </div>
        </div>

        <div className="home-cta-row">
          {isAuthenticated ? (
            <>
              <Link className="home-btn home-btn-primary" to="/dashboard">
                <i className="fa-solid fa-chart-pie" aria-hidden="true" /> Open Dashboard
              </Link>
              <Link className="home-btn home-btn-soft" to="/account">
                <i className="fa-solid fa-user" aria-hidden="true" /> Welcome, {user?.name || 'User'}
              </Link>
            </>
          ) : (
            <>
              <Link className="home-btn home-btn-primary" to="/signup">
                <i className="fa-solid fa-user-plus" aria-hidden="true" /> Get Started Free
              </Link>
              <Link className="home-btn home-btn-soft" to="/login">
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" /> Sign In
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="home-features">
        <h2 className="home-features-title">
          Powerful Features for Better Finance Management
        </h2>
        <div className="home-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="home-feature-card">
              <div className="home-feature-icon">
                <i className={feature.icon} aria-hidden="true" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="home-highlights">
        <article>
          <h3><i className="fa-solid fa-bolt" aria-hidden="true" /> Add expenses quickly</h3>
          <p>Capture amount, note, and date in seconds with our streamlined form.</p>
        </article>
        <article>
          <h3><i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Edit and delete any time</h3>
          <p>Keep your records accurate without friction. Full control over your data.</p>
        </article>
        <article>
          <h3><i className="fa-solid fa-chart-line" aria-hidden="true" /> See useful counts</h3>
          <p>Get instant totals, category breakdowns, and recent activity on your dashboard.</p>
        </article>
      </div>
      <div className="home-testimonials">
        <h2 className="home-testimonials-title">
          Loved by Thousands of Users
        </h2>
        <div className="home-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="home-testimonial-card">
              <div className="home-testimonial-avatar">
                <i className="fa-solid fa-user" aria-hidden="true" />
              </div>
              <p className="home-testimonial-text">"{testimonial.text}"</p>
              <div className="home-testimonial-name">{testimonial.name}</div>
              <div className="home-testimonial-role">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-cta-bottom">
        <h2>Ready to Take Control of Your Finances?</h2>
        <p>Join thousands of users who trust MyExpense for their daily tracking needs.</p>
        {!isAuthenticated && (
          <Link className="home-btn home-btn-primary" to="/signup">
            <i className="fa-solid fa-user-plus" aria-hidden="true" /> Create Free Account
          </Link>
        )}
        {isAuthenticated && (
          <Link className="home-btn home-btn-primary" to="/dashboard">
            <i className="fa-solid fa-chart-pie" aria-hidden="true" /> Go to Dashboard
          </Link>
        )}
      </div>
    </section>
  )
}

export default Home