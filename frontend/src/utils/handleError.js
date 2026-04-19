const handleError = (setToast, error) => {
	const message = error?.message || 'Something went wrong'
	setToast({ type: 'error', message })
}

export default handleError