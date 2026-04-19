import { useCallback, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ToastContainer from './components/ToastContainer/ToastContainer'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Dashboard from './pages/Dashboard/Dashboard'
import Account from './pages/Account/Account'

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

function App() {
	const [authed, setAuthed] = useState(isAuthenticated)
	const [user, setUser] = useState(readStoredUser)
	const [toast, setToast] = useState(null)

	const onAuthSuccess = useCallback((nextUser, token) => {
		if (token) {
			localStorage.setItem('token', token)
		}

		if (nextUser) {
			localStorage.setItem('user', JSON.stringify(nextUser))
			setUser(nextUser)
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
	}, [])

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Navbar isAuthenticated={authed} user={user} onLogout={onLogout} />

				<main className="app-main">
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
							path="/account"
							element={(
								<ProtectedRoute allow={authed}>
									<Account user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} setToast={setToast} />
								</ProtectedRoute>
							)}
						/>

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>

				<Footer />
				<ToastContainer toast={toast} onClose={() => setToast(null)} />
			</div>
		</BrowserRouter>
	)
}

export default App
