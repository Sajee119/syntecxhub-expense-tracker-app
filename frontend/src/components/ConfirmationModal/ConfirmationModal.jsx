import { useEffect, useId, useRef } from 'react'
import './ConfirmationModal.css'
import { createPortal } from 'react-dom'

const getActionIcons = ({ title, message, confirmText, danger }) => {
	const content = `${title || ''} ${message || ''} ${confirmText || ''}`.toLowerCase()

	if (content.includes('logout') || content.includes('log out') || content.includes('sign out')) {
		return {
			titleIcon: 'fa-right-from-bracket',
			confirmIcon: 'fa-right-from-bracket',
		}
	}

	if (content.includes('password')) {
		return {
			titleIcon: 'fa-key',
			confirmIcon: 'fa-key',
		}
	}

	if (content.includes('profile') || content.includes('account') || content.includes('save') || content.includes('update')) {
		return {
			titleIcon: 'fa-user-pen',
			confirmIcon: 'fa-floppy-disk',
		}
	}

	if (content.includes('delete') || content.includes('remove')) {
		return {
			titleIcon: 'fa-triangle-exclamation',
			confirmIcon: 'fa-trash-can',
		}
	}

	return {
		titleIcon: danger ? 'fa-triangle-exclamation' : 'fa-circle-question',
		confirmIcon: danger ? 'fa-triangle-exclamation' : 'fa-check',
	}
}

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
	const titleId = useId()
	const messageId = useId()
	const confirmButtonRef = useRef(null)
	const { titleIcon, confirmIcon } = getActionIcons({ title, message, confirmText, danger })

	useEffect(() => {
		if (!open) {
			return undefined
		}

		const originalOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = originalOverflow
		}
	}, [open])

	useEffect(() => {
		if (!open) {
			return undefined
		}

		confirmButtonRef.current?.focus()

		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && !disabled) {
				onCancel?.()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [disabled, onCancel, open])

	if (!open) return null

	const modalContent = (
		<div 
			className="confirm-popup-backdrop" 
			role="dialog" 
			aria-modal="true" 
			aria-labelledby={titleId}
			aria-describedby={messageId}
			onClick={(e) => {
				if (e.target === e.currentTarget && !disabled) {
					onCancel?.()
				}
			}}
		>
			<div className={`confirm-popup-container ${danger ? 'danger' : ''}`} tabIndex={-1}>
				<h4 id={titleId}>
					<i className={`fa-solid ${titleIcon}`} aria-hidden="true" />
					{title}
				</h4>
				<p id={messageId}>{message}</p>
				<div className="confirm-popup-actions">
					<button 
						type="button" 
						className="confirm-btn confirm-btn-soft" 
						onClick={() => onCancel?.()} 
						disabled={disabled}
					>
						<i className="fa-solid fa-xmark" aria-hidden="true" />
						{cancelText}
					</button>
					<button
						type="button"
						ref={confirmButtonRef}
						className={`confirm-btn ${danger ? 'confirm-btn-danger' : 'confirm-btn-primary'}`}
						onClick={() => onConfirm?.()}
						disabled={disabled}
					>
						<i className={`fa-solid ${confirmIcon}`} aria-hidden="true" />
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