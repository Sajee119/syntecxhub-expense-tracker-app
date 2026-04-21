import './ConfirmationModal.css'
import { createPortal } from 'react-dom'

const ConfirmationModal = ({
	open,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	onCancel,
	danger = false,
	disabled = false,
}) => {
	if (!open) return null

	const modalContent = (
		<div 
			className="confirm-popup-backdrop" 
			role="dialog" 
			aria-modal="true" 
			aria-labelledby="confirm-modal-title"
			onClick={(e) => {
				if (e.target === e.currentTarget && !disabled) {
					onCancel()
				}
			}}
		>
			<div className={`confirm-popup-container ${danger ? 'danger' : ''}`}>
				<h4 id="confirm-modal-title">
					<i className={`fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-circle-question'}`} aria-hidden="true" />
					{title}
				</h4>
				<p>{message}</p>
				<div className="confirm-popup-actions">
					<button 
						type="button" 
						className="confirm-btn confirm-btn-soft" 
						onClick={onCancel} 
						disabled={disabled}
					>
						<i className="fa-solid fa-xmark" aria-hidden="true" />
						{cancelText}
					</button>
					<button
						type="button"
						className={`confirm-btn ${danger ? 'confirm-btn-danger' : 'confirm-btn-primary'}`}
						onClick={onConfirm}
						disabled={disabled}
					>
						<i className={`fa-solid ${danger ? 'fa-trash-can' : 'fa-check'}`} aria-hidden="true" />
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	)

	if (typeof document === 'undefined') {
		return modalContent
	}

	return createPortal(modalContent, document.body)
}

export default ConfirmationModal