import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ isAuthenticated, user, onLogout }) => {
	return (
		<header className="main-navbar">
			<div className="main-navbar-inner">
				<Link className="brand" to="/">
					ExpenseTracker
				</Link>

				<nav className="nav-links">
					<NavLink to="/">
						<i className="fa-solid fa-house" aria-hidden="true" /> Home
					</NavLink>
					{isAuthenticated ? (
						<>
							<NavLink to="/dashboard">
								<i className="fa-solid fa-chart-column" aria-hidden="true" /> Dashboard
							</NavLink>
							<NavLink to="/account">
								<i className="fa-solid fa-user-gear" aria-hidden="true" /> Account
							</NavLink>
							<button type="button" className="nav-btn nav-btn-soft nav-logout" onClick={onLogout}>
								<i className="fa-solid fa-right-from-bracket" aria-hidden="true" /> Logout
							</button>
							<span className="nav-user">Hi, {user?.name || 'User'}</span>
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
