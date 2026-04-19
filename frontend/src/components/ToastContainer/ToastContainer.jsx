import { useEffect } from 'react'
import './ToastContainer.css'

const ToastContainer = ({ toast, onClose }) => {
	useEffect(() => {
		if (!toast) return undefined
		const timeout = window.setTimeout(() => {
			onClose()
		}, 2500)
		return () => window.clearTimeout(timeout)
	}, [toast, onClose])

	if (!toast) return null

	return (
		<div className={`toast-container ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
			<span>{toast.message}</span>
			<button type="button" onClick={onClose}>
				x
			</button>
		</div>
	)
}

export default ToastContainer
