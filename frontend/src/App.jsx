import { useCallback, useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ToastContainer from './components/ToastContainer/ToastContainer'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import Expense from './pages/Expense/Expense'
import Account from './pages/Account/Account'
import AboutPage from './pages/About/AboutPage'
import PrivacyPage from './pages/Privacy/PrivacyPage'
import TermsPage from './pages/Terms/TermsPage'
import SupportPage from './pages/Support/SupportPage'
import StatusPage from './pages/Status/StatusPage'
import { apiRequest } from './utils/api'

const readStoredUser = () => {
	try {
		const raw = localStorage.getItem('user')
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}

const isAuthenticated = () => Boolean(localStorage.getItem('token'))

const ProtectedRoute = ({ allow, children }) => {
	if (!allow) {
		return <Navigate to="/login" replace />
	}
	return children
}

const routeTitleMap = {
  '/': 'Home',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/account': 'Account',
  '/about': 'About',
	'/privacy': 'Privacy',
	'/terms': 'Terms',
	'/support': 'Support',
	'/status': 'Status',
}

const TitleManager = () => {
  const location = useLocation()

  useEffect(() => {
    const pageTitle = routeTitleMap[location.pathname] || 'Home'
    document.title = `Expense Tracker | ${pageTitle}`
  }, [location.pathname])

  return null
}

function App() {
	const [authed, setAuthed] = useState(isAuthenticated)
	const [user, setUser] = useState(readStoredUser)
	const [theme, setTheme] = useState(() => {
		const storedUser = readStoredUser()
		return storedUser?.theme || localStorage.getItem('theme') || 'light'
	})
	const [toast, setToast] = useState(null)
	const [isSavingTheme, setIsSavingTheme] = useState(false)

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	const onAuthSuccess = useCallback((nextUser, token) => {
		if (token) {
			localStorage.setItem('token', token)
		}

		if (nextUser) {
			localStorage.setItem('user', JSON.stringify(nextUser))
			setUser(nextUser)
			setTheme(nextUser.theme || 'light')
		}

		setAuthed(true)
	}, [])

	const onLogout = useCallback(() => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		setAuthed(false)
		setUser(null)
		setToast({ type: 'success', message: 'Logged out successfully.' })
	}, [])

	const onUserUpdate = useCallback((nextUser) => {
		setUser(nextUser)
		localStorage.setItem('user', JSON.stringify(nextUser))
		if (nextUser?.theme) {
			setTheme(nextUser.theme)
		}
	}, [])

	const onToggleTheme = useCallback(async () => {
		const nextTheme = theme === 'dark' ? 'light' : 'dark'
		setTheme(nextTheme)

		if (!authed || !user) {
			return
		}

		setIsSavingTheme(true)
		try {
			const data = await apiRequest('/users/theme', {
				method: 'PUT',
				body: JSON.stringify({ theme: nextTheme }),
			})

			if (data?.user) {
				setUser(data.user)
				localStorage.setItem('user', JSON.stringify(data.user))
			}
		} catch (error) {
			setTheme(theme)
			setToast({ type: 'error', message: error?.message || 'Unable to update theme preference.' })
		} finally {
			setIsSavingTheme(false)
		}
	}, [authed, theme, user])

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Navbar isAuthenticated={authed} user={user} onLogout={onLogout} />

				<main className="app-main">
					<TitleManager />
					<Routes>
						<Route path="/" element={<Home isAuthenticated={authed} user={user} />} />
						<Route path="/login" element={<Login onAuthSuccess={onAuthSuccess} setToast={setToast} />} />
						<Route path="/signup" element={<Signup setToast={setToast} />} />

						<Route
							path="/dashboard"
							element={(
								<ProtectedRoute allow={authed}>
									<Dashboard user={user} setToast={setToast} />
								</ProtectedRoute>
							)}
						/>

						<Route
							path="/expenses"
							element={(
								<ProtectedRoute allow={authed}>
									<Expense user={user} setToast={setToast} />
								</ProtectedRoute>
							)}
						/>

						<Route
							path="/account"
							element={(
								<ProtectedRoute allow={authed}>
									<Account user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} setToast={setToast} />
								</ProtectedRoute>
							)}
						/>

						<Route path="/about" element={<AboutPage />} />
						<Route path="/privacy" element={<PrivacyPage />} />
						<Route path="/terms" element={<TermsPage />} />
						<Route path="/support" element={<SupportPage />} />
						<Route path="/status" element={<StatusPage />} />

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>

				<Footer />
				<ThemeToggle theme={theme} onToggle={onToggleTheme} disabled={isSavingTheme} />
				<ToastContainer toast={toast} onClose={() => setToast(null)} />
			</div>
		</BrowserRouter>
	)
}

export default App
