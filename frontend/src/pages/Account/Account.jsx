import { useState } from 'react'
import { Link } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import './Account.css'

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'INR', 'LKR', 'GBP', 'AUD', 'CAD', 'JPY', 'AED']

const Account = ({ user, onLogout, onUserUpdate, setToast }) => {
	const [profileForm, setProfileForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		currency: user?.currency || 'USD',
	})
	const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)

	const onProfileChange = (event) => {
		const { name, value } = event.target
		setProfileForm((previous) => ({ ...previous, [name]: value }))
	}

	const onPasswordChange = (event) => {
		const { name, value } = event.target
		setPasswordForm((previous) => ({ ...previous, [name]: value }))
	}

	const onProfileSubmit = async (event) => {
		event.preventDefault()

		if (!profileForm.name || !profileForm.email || !profileForm.currency) {
			setToast({ type: 'error', message: 'Please complete your profile fields.' })
			return
		}

		setIsSavingProfile(true)
		try {
			const data = await apiRequest('/users/me', {
				method: 'PUT',
				body: JSON.stringify(profileForm),
			})

			if (data?.user) {
				onUserUpdate(data.user)
			}

			handleSuccess(setToast, data?.message || 'Profile updated successfully')
		} catch (error) {
			handleError(setToast, error)
		} finally {
			setIsSavingProfile(false)
		}
	}

	const onPasswordSubmit = async (event) => {
		event.preventDefault()

		if (!passwordForm.currentPassword || !passwordForm.newPassword) {
			setToast({ type: 'error', message: 'Please provide current and new password.' })
			return
		}

		setIsChangingPassword(true)
		try {
			const data = await apiRequest('/users/change-password', {
				method: 'POST',
				body: JSON.stringify(passwordForm),
			})

			handleSuccess(setToast, data?.message || 'Password changed successfully')
			setPasswordForm({ currentPassword: '', newPassword: '' })
		} catch (error) {
			handleError(setToast, error)
		} finally {
			setIsChangingPassword(false)
		}
	}

	return (
		<section className="account-page">
			{(isSavingProfile || isChangingPassword) && (
				<FullPageLoader label={isSavingProfile ? 'Saving profile...' : 'Changing password...'} />
			)}
			<div className="account-card">
				<h2>
					<i className="fa-solid fa-id-card account-icon" aria-hidden="true" /> My Account
				</h2>
				<p>Change login details, password, and preferred currency.</p>

				<div className="account-list">
					<div>
						<span>
							<i className="fa-solid fa-user account-icon" aria-hidden="true" /> Name
						</span>
						<strong>{user?.name || 'User'}</strong>
					</div>
					<div>
						<span>
							<i className="fa-solid fa-envelope account-icon" aria-hidden="true" /> Email
						</span>
						<strong>{user?.email || '-'}</strong>
					</div>
					<div>
						<span>
							<i className="fa-solid fa-coins account-icon" aria-hidden="true" /> Currency
						</span>
						<strong>{user?.currency || 'USD'}</strong>
					</div>
				</div>

				<form className="account-form" onSubmit={onProfileSubmit}>
					<h3>
						<i className="fa-solid fa-pen-to-square account-icon" aria-hidden="true" /> Change Login Details
					</h3>
					<label>
						Name
						<input type="text" name="name" value={profileForm.name} onChange={onProfileChange} required />
					</label>
					<label>
						Email
						<input type="email" name="email" value={profileForm.email} onChange={onProfileChange} required />
					</label>
					<label>
						Currency
						<select name="currency" value={profileForm.currency} onChange={onProfileChange}>
							{SUPPORTED_CURRENCIES.map((currency) => (
								<option key={currency} value={currency}>
									{currency}
								</option>
							))}
						</select>
					</label>
					<button className="account-btn account-btn-primary" type="submit" disabled={isSavingProfile}>
						Update Profile
					</button>
				</form>

				<form className="account-form" onSubmit={onPasswordSubmit}>
					<h3>
						<i className="fa-solid fa-key account-icon" aria-hidden="true" /> Change Password
					</h3>
					<label>
						Current Password
						<input
							type="password"
							name="currentPassword"
							value={passwordForm.currentPassword}
							onChange={onPasswordChange}
							required
						/>
					</label>
					<label>
						New Password
						<input
							type="password"
							name="newPassword"
							value={passwordForm.newPassword}
							onChange={onPasswordChange}
							required
						/>
					</label>
					<button className="account-btn account-btn-soft" type="submit" disabled={isChangingPassword}>
						Update Password
					</button>
				</form>

				<div className="account-actions">
					<Link className="account-btn account-btn-soft" to="/dashboard">
						<i className="fa-solid fa-chart-column account-icon" aria-hidden="true" /> Back to Dashboard
					</Link>
					<button className="account-btn account-btn-danger" type="button" onClick={onLogout}>
						<i className="fa-solid fa-right-from-bracket account-icon" aria-hidden="true" /> Logout
					</button>
				</div>
			</div>
		</section>
	)
}

export default Account
