import { useState } from 'react'
import './SupportPage.css'

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  })

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleTicketChange = (e) => {
    const { name, value } = e.target
    setTicketForm(prev => ({ ...prev, [name]: value }))
  }

  const faqItems = [
    {
      question: 'How do I add or edit an expense?',
      answer: 'Go to the Expenses page, click "Add Expense", fill in the amount, description, category, and date. To edit, click the edit icon next to any expense in your list.'
    },
    {
      question: 'How do I set a monthly budget?',
      answer: 'On your Dashboard, find the Monthly Budget section. Enter your desired budget amount and click "Save Budget". You can update it anytime.'
    },
    {
      question: 'How do I switch between dark and light mode?',
      answer: 'Click the theme toggle button (sun/moon icon) in the top navigation bar to switch between dark and light mode. Your preference is saved automatically.'
    },
    {
      question: 'How do I export my expense data?',
      answer: 'On the Expenses page, use the filters to select the expenses you want, then click the "Export CSV" button to download your data.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Account Settings, scroll to the bottom, and click "Delete Account". This action is permanent and cannot be undone.'
    },
    {
      question: 'What currencies are supported?',
      answer: 'We support USD, EUR, INR, LKR, GBP, AUD, CAD, JPY, and AED. You can change your currency in Account Settings.'
    }
  ]

  return (
    <main className="support-page">
      <div className="support-container">
        <section className="support-hero">
          <div className="support-eyebrow">
            <i className="fa-solid fa-headset" aria-hidden="true" /> 24/7 Support
          </div>
          <h1 className="support-title">Support Center</h1>
          <p className="support-subtitle">
            Need help with login, expenses, budgets, or theme settings? 
            We're here to assist you every step of the way.
          </p>
        </section>

        <div className="support-content">
          <section className="support-section">
            <h2>
              <i className="fa-solid fa-address-card" aria-hidden="true" /> Contact Options
            </h2>
            <div className="support-contact-grid">
              <div className="support-contact-card">
                <div className="support-contact-icon">
                  <i className="fa-solid fa-envelope" aria-hidden="true" />
                </div>
                <h3>Email Support</h3>
                <div className="support-contact-value">Sajeepan634@gmail.com</div>
                <div className="support-contact-response">Response within 4 hours</div>
              </div>
              <div className="support-contact-card">
                <div className="support-contact-icon">
                  <i className="fa-solid fa-phone" aria-hidden="true" />
                </div>
                <h3>Phone Support</h3>
                <div className="support-contact-value">+94 78 356 6823</div>
                <div className="support-contact-response">Mon-Fri, 9AM-6PM</div>
              </div>
              <div className="support-contact-card">
                <div className="support-contact-icon">
                  <i className="fa-brands fa-whatsapp" aria-hidden="true" />
                </div>
                <h3>WhatsApp</h3>
                <div className="support-contact-value">+94 78 356 6823</div>
                <div className="support-contact-response">Quick responses</div>
              </div>
            </div>
          </section>
          <section className="support-live-chat">
            <h3>
              <i className="fa-solid fa-message" aria-hidden="true" /> Live Chat Support
            </h3>
            <p>Get instant answers from our support team</p>
            <button className="support-chat-btn" onClick={() => window.open("https://wa.me/94783566823", "_blank")}>
              <i className="fa-solid fa-comment-dots" aria-hidden="true" /> Start Live Chat
            </button>
            <div className="support-chat-availability">
              <i className="fa-solid fa-circle" style={{ fontSize: '0.6rem', marginRight: '0.5rem', color: '#10b981' }} />
              Available now
            </div>
          </section>
          <section className="support-section">
            <h2>
              <i className="fa-solid fa-circle-question" aria-hidden="true" /> Frequently Asked Questions
            </h2>
            <div className="support-faq-grid">
              {faqItems.map((item, index) => (
                <div key={index} className={`support-faq-item ${openFaq === index ? 'open' : ''}`}>
                  <div 
                    className="support-faq-question" 
                    onClick={() => toggleFaq(index)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && toggleFaq(index)}
                  >
                    <i className="fa-solid fa-question-circle" aria-hidden="true" />
                    <span>{item.question}</span>
                    <i className="fa-solid fa-chevron-down" aria-hidden="true" />
                  </div>
                  {openFaq === index && (
                    <div className="support-faq-answer">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="support-section">
            <h2>
              <i className="fa-solid fa-lightbulb" aria-hidden="true" /> Quick Tips
            </h2>
            <div className="support-tips-grid">
              <div className="support-tip-card">
                <div className="support-tip-icon">
                  <i className="fa-solid fa-chart-line" aria-hidden="true" />
                </div>
                <div className="support-tip-content">
                  <h4>Track Weekly Trends</h4>
                  <p>Check your dashboard to see spending patterns by day of week</p>
                </div>
              </div>
              <div className="support-tip-card">
                <div className="support-tip-icon">
                  <i className="fa-solid fa-bullseye" aria-hidden="true" />
                </div>
                <div className="support-tip-content">
                  <h4>Set Spending Goals</h4>
                  <p>Create category-specific goals to stay on track</p>
                </div>
              </div>
              <div className="support-tip-card">
                <div className="support-tip-icon">
                  <i className="fa-solid fa-filter" aria-hidden="true" />
                </div>
                <div className="support-tip-content">
                  <h4>Use Filters</h4>
                  <p>Filter expenses by date, category, or search description</p>
                </div>
              </div>
              <div className="support-tip-card">
                <div className="support-tip-icon">
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </div>
                <div className="support-tip-content">
                  <h4>Export Data</h4>
                  <p>Download your expense history as CSV anytime</p>
                </div>
              </div>
            </div>
          </section>
          <section className="support-section">
            <h2>
              <i className="fa-solid fa-ticket" aria-hidden="true" /> Submit a Support Ticket
            </h2>
            <form
              className="support-ticket-form"
              action="https://formsubmit.co/sajeepan634@gmail.com"
              method="POST"
            >
              <input type="hidden" name="_subject" value="New Support Ticket - Expense Tracker" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={ticketForm.name}
                onChange={handleTicketChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={ticketForm.email}
                onChange={handleTicketChange}
                required
              />
              <select
                name="category"
                value={ticketForm.category}
                onChange={handleTicketChange}
              >
                <option value="general">General Question</option>
                <option value="account">Account Issues</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Problem</option>
                <option value="feature">Feature Request</option>
              </select>
              <textarea
                name="message"
                placeholder="Describe your issue in detail..."
                value={ticketForm.message}
                onChange={handleTicketChange}
                required
              />
              <button type="submit" className="support-submit-btn">
                <i className="fa-solid fa-paper-plane" aria-hidden="true" /> Submit Ticket
              </button>
            </form>
          </section>
        </div>

        <div className="support-last-updated">
          <span className="support-status-badge">
            <i className="fa-solid fa-circle" aria-hidden="true" /> All Systems Operational
          </span>
          <span style={{ marginLeft: '1rem' }}>
            <i className="fa-regular fa-clock" aria-hidden="true" /> Support Hours: 24/7
          </span>
        </div>
      </div>
    </main>
  )
}

export default SupportPage