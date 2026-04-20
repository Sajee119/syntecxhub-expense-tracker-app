import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import './Navbar.css'

const Navbar = ({ isAuthenticated, user, onLogout }) => {
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

	const confirmLogout = () => {
		onLogout()
		setShowLogoutConfirm(false)
	}

	return (
		<header className="main-navbar">
			<ConfirmationModal
				open={showLogoutConfirm}
				title="Confirm Logout"
				message="Are you sure you want to logout?"
				confirmText="Yes, Logout"
				onConfirm={confirmLogout}
				onCancel={() => setShowLogoutConfirm(false)}
				danger
			/>
			<div className="main-navbar-inner">
				<Link className="brand" to="/">
					ExpenseTracker
				</Link>

				<nav className="nav-links">
					<NavLink to="/">
						<i className="fa-solid fa-house" aria-hidden="true" /> Home
					</NavLink>				
					<NavLink to="/about">
						<i className="fa-solid fa-circle-info" aria-hidden="true" /> About
					</NavLink>					
					{isAuthenticated ? (
						<>
							<NavLink to="/dashboard">
								<i className="fa-solid fa-chart-column" aria-hidden="true" /> Dashboard
							</NavLink>
							<NavLink to="/expenses">
								<i className="fa-solid fa-receipt" aria-hidden="true" /> Expenses
							</NavLink>
							<NavLink to="/account">
								<i className="fa-solid fa-user-gear" aria-hidden="true" /> Account
							</NavLink>
							<span className="nav-user">Hi, {user?.name || 'User'}</span>
							<button type="button" className="nav-btn nav-btn-soft nav-logout" onClick={() => setShowLogoutConfirm(true)}>
								<i className="fa-solid fa-right-from-bracket" aria-hidden="true" /> Logout
							</button>
							
						</>
					) : (
						<>
							<NavLink to="/login">
								<i className="fa-solid fa-right-to-bracket" aria-hidden="true" /> Login
							</NavLink>
							<NavLink to="/signup">
								<i className="fa-solid fa-user-plus" aria-hidden="true" /> Signup
							</NavLink>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}

export default Navbar
