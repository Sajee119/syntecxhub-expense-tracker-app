import { useState } from 'react'
import { Link } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY, getCurrencySymbol } from '../../utils/currency'
import './Account.css'

const Account = ({ user, onLogout, onUserUpdate, setToast }) => {
	const [profileForm, setProfileForm] = useState({
		name: user?.name || '',
		email: user?.email || '',
		currency: user?.currency || DEFAULT_CURRENCY,
	})
	const currencySymbol = getCurrencySymbol(user?.currency)
	const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
	const [isSavingProfile, setIsSavingProfile] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [pendingAction, setPendingAction] = useState(null)

	const onProfileChange = (event) => {
		const { name, value } = event.target
		setProfileForm((previous) => ({ ...previous, [name]: value }))
	}

	const onPasswordChange = (event) => {
		const { name, value } = event.target
		setPasswordForm((previous) => ({ ...previous, [name]: value }))
	}

	const saveProfile = async () => {
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

	const savePassword = async () => {
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

	const requestActionConfirmation = (actionType) => {
		setPendingAction(actionType)
	}

	const closeConfirmation = () => {
		setPendingAction(null)
	}

	const confirmAction = async () => {
		if (pendingAction === 'profile') {
			await saveProfile()
		}

		if (pendingAction === 'password') {
			await savePassword()
		}

		if (pendingAction === 'logout') {
			onLogout()
		}

		closeConfirmation()
	}

	const modalConfig = {
		profile: {
			title: 'Confirm Profile Update',
			message: 'Do you want to save these account settings changes?',
			confirmText: 'Yes, Save',
			danger: false,
		},
		password: {
			title: 'Confirm Password Change',
			message: 'Are you sure you want to update your password?',
			confirmText: 'Yes, Update',
			danger: true,
		},
		logout: {
			title: 'Confirm Logout',
			message: 'Do you want to logout from your account?',
			confirmText: 'Yes, Logout',
			danger: true,
		},
	}

	const activeModal = pendingAction ? modalConfig[pendingAction] : null

	return (
		<section className="account-page">
			{(isSavingProfile || isChangingPassword) && (
				<FullPageLoader label={isSavingProfile ? 'Saving profile...' : 'Changing password...'} />
			)}
			<ConfirmationModal
				open={Boolean(activeModal)}
				title={activeModal?.title}
				message={activeModal?.message}
				confirmText={activeModal?.confirmText}
				onConfirm={confirmAction}
				onCancel={closeConfirmation}
				danger={Boolean(activeModal?.danger)}
				disabled={isSavingProfile || isChangingPassword}
			/>
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
						<strong>{currencySymbol} ({user?.currency || DEFAULT_CURRENCY})</strong>
					</div>
				</div>

				<form className="account-form" onSubmit={(event) => {
					event.preventDefault()
					requestActionConfirmation('profile')
				}}>
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
								<option key={currency.code} value={currency.code}>
									{currency.code} - {currency.name} ({currency.symbol})
								</option>
							))}
						</select>
					</label>
					<button className="account-btn account-btn-primary" type="submit" disabled={isSavingProfile}>
						Update Profile
					</button>
				</form>

				<form className="account-form" onSubmit={(event) => {
					event.preventDefault()
					requestActionConfirmation('password')
				}}>
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
					<button className="account-btn account-btn-danger" type="button" onClick={() => requestActionConfirmation('logout')}>
						<i className="fa-solid fa-right-from-bracket account-icon" aria-hidden="true" /> Logout
					</button>
				</div>
			</div>
		</section>
	)
}

export default Account
