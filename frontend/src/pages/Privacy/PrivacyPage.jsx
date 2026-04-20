import './PrivacyPage.css'

const PrivacyPage = () => {
  const currentYear = new Date().getFullYear()
  const lastUpdated = 'April 20, 2026'

  return (
    <main className="info-page">
      <div className="info-page__container">
        <section className="info-page__hero">
          <div className="info-page__eyebrow">
            <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Privacy & Security
          </div>
          <h1 className="info-page__title">Privacy Policy</h1>
          <p className="info-page__subtitle">
            We store only the data needed to run your account, secure your session, 
            and save preferences like theme, budget, and currency. Your privacy is our priority.
          </p>
        </section>

        <div className="info-page__content">
          <section className="info-section">
            <h2>
              <i className="fa-solid fa-database" aria-hidden="true" /> What We Collect
            </h2>
            <ul className="info-list">
              <li>Account details such as name, email, currency, and theme preference.</li>
              <li>Expense, budget, and goal data you choose to save.</li>
              <li>Authentication tokens to keep your session secure.</li>
              <li>Device information and IP address for security purposes.</li>
              <li>Usage analytics to improve the application (anonymized).</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-gear" aria-hidden="true" /> How We Use Your Data
            </h2>
            <ul className="info-list">
              <li>To display your dashboard and account information.</li>
              <li>To persist your saved preferences in MongoDB.</li>
              <li>To improve the product and provide customer support.</li>
              <li>To send important account notifications (password changes, login alerts).</li>
              <li>To generate spending insights and analytics for you.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-lock" aria-hidden="true" /> Data Security
            </h2>
            <div className="info-grid">
              <div className="info-card">
                <h3><i className="fa-solid fa-key" aria-hidden="true" /> Encryption</h3>
                <p>All data is encrypted in transit using SSL/TLS. Passwords are hashed and never stored in plain text.</p>
              </div>
              <div className="info-card">
                <h3><i className="fa-solid fa-clock" aria-hidden="true" /> Session Management</h3>
                <p>Authentication tokens expire after inactivity. You can log out from all devices at any time.</p>
              </div>
              <div className="info-card">
                <h3><i className="fa-solid fa-database" aria-hidden="true" /> Data Backup</h3>
                <p>Your data is backed up regularly to prevent loss. Backups are encrypted and stored securely.</p>
              </div>
              <div className="info-card">
                <h3><i className="fa-solid fa-eye-slash" aria-hidden="true" /> Privacy Controls</h3>
                <p>You can export or delete your data at any time from your account settings.</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Data Retention
            </h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data Type</th>
                  <th>Retention Period</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account Information</td>
                  <td>Until account deletion</td>
                  <td>Account management</td>
                </tr>
                <tr>
                  <td>Expense Records</td>
                  <td>Until account deletion</td>
                  <td>Financial tracking</td>
                </tr>
                <tr>
                  <td>Session Tokens</td>
                  <td>30 days or until logout</td>
                  <td>Authentication</td>
                </tr>
                <tr>
                  <td>Analytics Data</td>
                  <td>12 months</td>
                  <td>Product improvement</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-user-check" aria-hidden="true" /> Your Rights
            </h2>
            <ul className="info-list">
              <li><strong>Access:</strong> Request a copy of all your personal data.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
              <li><strong>Deletion:</strong> Request permanent deletion of your account and data.</li>
              <li><strong>Export:</strong> Download your data in a portable format.</li>
              <li><strong>Opt-out:</strong> Disable analytics tracking from your account settings.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-cookie-bite" aria-hidden="true" /> Cookies & Tracking
            </h2>
            <ul className="info-list">
              <li>Essential cookies for authentication and session management.</li>
              <li>Preference cookies to remember your theme and language settings.</li>
              <li>Analytics cookies (optional) to help us understand usage patterns.</li>
              <li>You can manage cookie preferences in your browser settings.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>
              <i className="fa-solid fa-envelope" aria-hidden="true" /> Contact Us
            </h2>
            <div className="contact-info">
              <h3>Have questions about your privacy?</h3>
              <p>Our privacy team is here to help. Reach out to us anytime.</p>
              <a href="mailto:privacy@expensetracker.com" className="contact-email">
                <i className="fa-solid fa-envelope" aria-hidden="true" /> privacy@expensetracker.com
              </a>
            </div>
          </section>
        </div>

        <div className="last-updated">
          <i className="fa-regular fa-calendar" aria-hidden="true" /> Last Updated: {lastUpdated} • 
          Effective for all users as of {currentYear}
        </div>
      </div>
    </main>
  )
}

export default PrivacyPage