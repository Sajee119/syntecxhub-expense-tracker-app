import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../../utils/currency'
import './Signup.css'

const Signup = ({ setToast }) => {
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		currency: DEFAULT_CURRENCY,
	})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((previous) => ({ ...previous, [name]: value }))
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		if (!form.name || !form.email || !form.password) {
			setToast({ type: 'error', message: 'Please complete all required fields.' })
			return
		}

		if (form.password.length < 6) {
			setToast({ type: 'error', message: 'Password must be at least 6 characters.' })
			return
		}

		setIsSubmitting(true)
		try {
			await apiRequest('/users/signup', {
				method: 'POST',
				body: JSON.stringify(form),
			})
			handleSuccess(setToast, 'Account created. Please login.')
			navigate('/login')
		} catch (error) {
			handleError(setToast, error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="signup-auth-page">
			{isSubmitting && <FullPageLoader label="Creating account..." />}
			<div className="auth-card">
				<h2>
					<i className="fa-solid fa-user-plus" aria-hidden="true" /> Signup
				</h2>
				<p>Create your expense tracker account.</p>

				<form onSubmit={onSubmit} className="auth-form">
					<label>
						Full Name
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={onChange}
							placeholder="Your name"
							required
						/>
					</label>

					<label>
						Email
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={onChange}
							placeholder="you@example.com"
							required
						/>
					</label>

					<label>
						Password
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={onChange}
							placeholder="At least 6 characters"
							required
						/>
					</label>

					<label>
						Preferred Currency
						<select name="currency" value={form.currency} onChange={onChange}>
							{SUPPORTED_CURRENCIES.map((currency) => (
								<option key={currency.code} value={currency.code}>
									{currency.code} - {currency.name} ({currency.symbol})
								</option>
							))}
						</select>
					</label>

					<button className="btn btn-primary" type="submit" disabled={isSubmitting}>
						Signup
					</button>
				</form>

				<p className="auth-switch">
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</section>
	)
}

export default Signup
