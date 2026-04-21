import { useState } from 'react'
import './StatusPage.css'

const StatusPage = () => {
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const currentTime = new Date().toLocaleString()

  const services = [
    {
      name: 'Web App',
      icon: 'fa-solid fa-window-maximize',
      status: 'operational',
      uptime: '99.99%',
      latency: '120ms',
      responseTime: '0.8s'
    },
    {
      name: 'API Gateway',
      icon: 'fa-solid fa-cloud',
      status: 'operational',
      uptime: '99.95%',
      latency: '95ms',
      responseTime: '0.6s'
    },
    {
      name: 'Database',
      icon: 'fa-solid fa-database',
      status: 'operational',
      uptime: '99.99%',
      latency: '45ms',
      responseTime: '0.3s'
    },
    {
      name: 'Authentication',
      icon: 'fa-solid fa-key',
      status: 'operational',
      uptime: '99.98%',
      latency: '80ms',
      responseTime: '0.5s'
    },
    {
      name: 'File Storage',
      icon: 'fa-solid fa-folder-open',
      status: 'operational',
      uptime: '99.97%',
      latency: '110ms',
      responseTime: '0.7s'
    }
  ]

  const timelineDays = [
    { day: 'Mon', status: 'operational' },
    { day: 'Tue', status: 'operational' },
    { day: 'Wed', status: 'operational' },
    { day: 'Thu', status: 'operational' },
    { day: 'Fri', status: 'degraded' },
    { day: 'Sat', status: 'operational' },
    { day: 'Sun', status: 'operational' }
  ]

  const incidents = [
    {
      name: 'API Latency Issues',
      status: 'resolved',
      date: 'April 15, 2026',
      description: 'Increased API response times between 2:00 PM - 3:30 PM. Issue has been resolved.'
    },
    {
      name: 'Database Connection Timeout',
      status: 'resolved',
      date: 'April 10, 2026',
      description: 'Intermittent database connection issues affecting 2% of users for 15 minutes.'
    },
    {
      name: 'Maintenance Window',
      status: 'monitoring',
      date: 'April 18, 2026',
      description: 'Scheduled maintenance completed. Monitoring for any issues.'
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (subscriberEmail) {
      alert(`Subscribed with ${subscriberEmail}! You will receive status updates.`)
      setSubscriberEmail('')
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return 'fa-solid fa-circle-check'
      case 'degraded': return 'fa-solid fa-circle-exclamation'
      case 'outage': return 'fa-solid fa-circle-xmark'
      case 'maintenance': return 'fa-solid fa-wrench'
      default: return 'fa-solid fa-question-circle'
    }
  }

  return (
    <main className="status-page">
      <div className="status-container">
        <section className="status-hero">
          <div className="status-eyebrow">
            <i className="fa-solid fa-chart-line" aria-hidden="true" /> Real-time Monitoring
          </div>
          <h1 className="status-title">System Status</h1>
          <p className="status-subtitle">
            Track service health for the app, API, and database connectivity. 
            All systems are monitored 24/7 for optimal performance.
          </p>
        </section>
        <div className="status-overall">
          <div className="status-overall-badge">
            <i className="fa-solid fa-circle-check" aria-hidden="true" />
            All Systems Operational
          </div>
          <div className="status-overall-text">
            Last checked: {currentTime} • No active incidents
          </div>
        </div>
        <div className="status-services-grid">
          {services.map((service, index) => (
            <div key={index} className="status-service-card">
              <div className="status-service-header">
                <div className="status-service-name">
                  <i className={service.icon} aria-hidden="true" />
                  {service.name}
                </div>
                <div className={`status-service-status ${service.status}`}>
                  <i className={getStatusIcon(service.status)} aria-hidden="true" />
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </div>
              </div>
              <div className="status-service-metrics">
                <div className="status-metric">
                  <div className="status-metric-label">Uptime</div>
                  <div className="status-metric-value">{service.uptime}</div>
                </div>
                <div className="status-metric">
                  <div className="status-metric-label">Latency</div>
                  <div className="status-metric-value">{service.latency}</div>
                </div>
                <div className="status-metric">
                  <div className="status-metric-label">Response</div>
                  <div className="status-metric-value">{service.responseTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="status-timeline-section">
          <h3>
            <i className="fa-solid fa-calendar-week" aria-hidden="true" /> 7-Day Uptime History
          </h3>
          <div className="status-timeline">
            {timelineDays.map((day, index) => (
              <div key={index} className={`status-timeline-day ${day.status}`}>
                <span>{day.day}</span>
                <span>{day.status === 'operational' ? '✓' : '⚠'}</span>
              </div>
            ))}
          </div>
          <div className="status-overall-text" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <i className="fa-solid fa-chart-line" aria-hidden="true" /> 99.98% uptime over the last 30 days
          </div>
        </div>
        <div className="status-incidents-section">
          <h3>
            <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" /> Incident History
          </h3>
          {incidents.map((incident, index) => (
            <div key={index} className={`status-incident-item ${incident.status}`}>
              <div className="status-incident-title">
                <span className="status-incident-name">
                  <i className={getStatusIcon(incident.status)} aria-hidden="true" /> {incident.name}
                </span>
                <span className="status-incident-date">{incident.date}</span>
              </div>
              <div className="status-incident-description">{incident.description}</div>
            </div>
          ))}
        </div>
        <div className="status-subscribe-section">
          <h3>
            <i className="fa-solid fa-bell" aria-hidden="true" /> Get Status Updates
          </h3>
          <p>Subscribe to receive notifications about system status changes</p>
          <form className="status-subscribe-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="status-subscribe-input"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={(e) => setSubscriberEmail(e.target.value)}
              required
            />
            <button type="submit" className="status-subscribe-btn">
              <i className="fa-solid fa-bell" aria-hidden="true" /> Subscribe
            </button>
          </form>
        </div>

        <div className="status-last-updated">
          <i className="fa-regular fa-clock" aria-hidden="true" /> Status data updates every 30 seconds • 
          RSS Feed • <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>JSON API</a>
        </div>
      </div>
    </main>
  )
}

export default StatusPage