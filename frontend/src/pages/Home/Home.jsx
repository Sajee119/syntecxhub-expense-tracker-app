import { Link } from 'react-router-dom'
import './Home.css'

const Home = ({ isAuthenticated, user }) => {
  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-eyebrow">Track Smart. Spend Better.</p>
        <h1>Personal expense tracking that is simple and fast.</h1>
        <p>
          Manage daily spending, understand your habits, and build financial discipline with one
          clean dashboard.
        </p>

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
                <i className="fa-solid fa-user-plus" aria-hidden="true" /> Create Account
              </Link>
              <Link className="home-btn home-btn-soft" to="/login">
                <i className="fa-solid fa-right-to-bracket" aria-hidden="true" /> Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="home-highlights">
        <article>
          <h3><i className="fa-solid fa-bolt" aria-hidden="true" /> Add expenses quickly</h3>
          <p>Capture amount, note, and date in seconds.</p>
        </article>
        <article>
          <h3><i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Edit and delete any time</h3>
          <p>Keep your records accurate without friction.</p>
        </article>
        <article>
          <h3><i className="fa-solid fa-chart-line" aria-hidden="true" /> See useful counts</h3>
          <p>Get instant totals and recent activity on your dashboard.</p>
        </article>
      </div>
    </section>
  )
}

export default Home