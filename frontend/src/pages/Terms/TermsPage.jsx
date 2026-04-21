import './TermsPage.css'

const TermsPage = () => {
  const currentYear = new Date().getFullYear()
  const lastUpdated = 'April 20, 2026'
  const effectiveDate = 'April 1, 2026'

  return (
    <main className="terms-page">
      <div className="terms-container">
        <section className="terms-hero">
          <div className="terms-eyebrow">
            <i className="fa-solid fa-file-contract" aria-hidden="true" /> Legal Agreement
          </div>
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-subtitle">
            Use expensetracker Expense Tracker responsibly. Your account is for personal finance 
            tracking and dashboard analytics only. By using our service, you agree to these terms.
          </p>
        </section>

        <div className="terms-content">
          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-circle-check" aria-hidden="true" /> Acceptance of Terms
            </h2>
            <ul className="terms-list-numbered">
              <li>By accessing or using Expense Tracker Expense Tracker, you agree to be bound by these Terms of Service.</li>
              <li>If you do not agree to these terms, please do not use our service.</li>
              <li>These terms apply to all users, including those who are simply viewing content.</li>
              <li>We reserve the right to update these terms at any time. Continued use constitutes acceptance.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-user-check" aria-hidden="true" /> Account Registration
            </h2>
            <ul className="terms-list">
              <li>You must be at least 13 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You agree to provide accurate and complete registration information.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-gavel" aria-hidden="true" /> Acceptable Use Policy
            </h2>
            <div className="terms-grid">
              <div className="terms-card">
                <h4><i className="fa-solid fa-ban" aria-hidden="true" /> Prohibited Actions</h4>
                <p>Do not attempt to disrupt, overload, or bypass security on the service.</p>
              </div>
              <div className="terms-card">
                <h4><i className="fa-solid fa-skull-crossbones" aria-hidden="true" /> Malicious Content</h4>
                <p>Do not use the app to store unlawful, harmful, or malicious content.</p>
              </div>
              <div className="terms-card">
                <h4><i className="fa-solid fa-key" aria-hidden="true" /> Account Security</h4>
                <p>Keep your account credentials secure. Do not share passwords.</p>
              </div>
              <div className="terms-card">
                <h4><i className="fa-solid fa-robot" aria-hidden="true" /> Automated Access</h4>
                <p>Do not use bots, scrapers, or automated tools to access the service.</p>
              </div>
            </div>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-chart-line" aria-hidden="true" /> Service Terms
            </h2>
            <ul className="terms-list">
              <li>Features and availability may change as the product evolves.</li>
              <li>We may update these terms to reflect product or legal changes.</li>
              <li>By using the app, you agree to these terms and future updates.</li>
              <li>We strive for 99.9% uptime but do not guarantee uninterrupted service.</li>
              <li>Maintenance windows will be announced when possible.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-copyright" aria-hidden="true" /> Intellectual Property
            </h2>
            <ul className="terms-list-numbered">
              <li>All content, features, and functionality are owned by Expense Tracker.</li>
              <li>You retain ownership of the data you submit to the service.</li>
              <li>You grant us a license to store, process, and display your data as needed.</li>
              <li>You may not copy, modify, or reverse engineer any part of the service.</li>
              <li>The Expense Tracker name and logo are trademarks and may not be used without permission.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-trash-can" aria-hidden="true" /> Account Termination
            </h2>
            <ul className="terms-list-numbered">
              <li>You may delete your account at any time from account settings.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
              <li>Upon termination, your data will be permanently deleted within 30 days.</li>
              <li>We may retain anonymized analytics data after account deletion.</li>
              <li>Termination does not waive any rights or obligations incurred before termination.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-handshake" aria-hidden="true" /> Limitation of Liability
            </h2>
            <div className="terms-notice">
              <p>
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                Expense Tracker is not responsible for financial decisions made based on app data. 
                The service is provided "as is" without warranties of any kind.
              </p>
            </div>
            <ul className="terms-list">
              <li>We are not liable for indirect, incidental, or consequential damages.</li>
              <li>Our total liability shall not exceed the amount paid for the service (if any).</li>
              <li>We do not warrant that the service will meet your specific requirements.</li>
              <li>You assume full responsibility for your financial decisions.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>
              <i className="fa-solid fa-envelope" aria-hidden="true" /> Contact & Dispute Resolution
            </h2>
            <div className="terms-contact">
              <h3>Questions about these Terms?</h3>
              <p>Our legal team is available to clarify any questions you may have.</p>
              <a href="mailto:sajeepan634@gmail.com" className="terms-contact-email">
                <i className="fa-solid fa-envelope" aria-hidden="true" /> sajeepan634@gmail.com
              </a>
            </div>
            <ul className="terms-list" style={{ marginTop: '1rem' }}>
              <li>These terms are governed by the laws of [Your Jurisdiction].</li>
              <li>Any disputes shall be resolved through binding arbitration.</li>
              <li>You agree to first contact us to resolve any issues informally.</li>
            </ul>
          </section>
        </div>

        <div className="terms-last-updated">
          <span><i className="fa-regular fa-calendar" aria-hidden="true" /> Last Updated: {lastUpdated}</span>
          <span><i className="fa-regular fa-clock" aria-hidden="true" /> Effective: {effectiveDate}</span>
          <span><i className="fa-regular fa-building" aria-hidden="true" /> Expense Tracker © {currentYear}</span>
        </div>
      </div>
    </main>
  )
}

export default TermsPage