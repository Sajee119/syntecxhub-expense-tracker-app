import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import { apiRequest } from '../../utils/api'
import handleError from '../../utils/handleError'
import handleSuccess from '../../utils/handleSuccess'
import { DEFAULT_CURRENCY } from '../../utils/currency'
import './Login.css'

const Login = ({ onAuthSuccess, setToast }) => {
	const [form, setForm] = useState({ email: '', password: '' })
	const [isSubmitting, setIsSubmitting] = useState(false)
	const navigate = useNavigate()

	const onChange = (event) => {
		const { name, value } = event.target
		setForm((previous) => ({ ...previous, [name]: value }))
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		if (!form.email || !form.password) {
			setToast({ type: 'error', message: 'Please fill in email and password.' })
			return
		}

		setIsSubmitting(true)
		try {
			const data = await apiRequest('/users/login', {
				method: 'POST',
				body: JSON.stringify(form),
			})

			onAuthSuccess(
				{
					name: data?.user?.name || 'User',
					email: data?.user?.email || form.email,
					currency: data?.user?.currency || DEFAULT_CURRENCY,
				},
				data?.token,
			)
			handleSuccess(setToast, 'Login successful')
			navigate('/dashboard')
		} catch (error) {
			handleError(setToast, error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className="auth-page">
			{isSubmitting && <FullPageLoader label="Logging in..." />}
			<div className="auth-card">
				<h2>
					<i className="fa-solid fa-right-to-bracket" aria-hidden="true" /> Login
				</h2>
				<p>Access your expense dashboard.</p>

				<form onSubmit={onSubmit} className="auth-form">
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
							placeholder="********"
							required
						/>
					</label>

					<button className="btn btn-primary" type="submit" disabled={isSubmitting}>
						Login
					</button>
				</form>

				<p className="auth-switch">
					No account yet? <Link to="/signup">Create one</Link>
				</p>
			</div>
		</section>
	)
}

export default Login
