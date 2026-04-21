export const APIUrl = import.meta.env.VITE_API_URL

export const apiRequest = async (path, options = {}) => {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {}),
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	let response
	try {
		response = await fetch(`${APIUrl}${path}`, {
			...options,
			headers,
		})
	} catch {
		throw new Error('Unable to connect to server. Please make sure backend is running.')
	}

	const rawBody = await response.text()
	let payload = null

	if (rawBody) {
		try {
			payload = JSON.parse(rawBody)
		} catch {
			payload = null
		}
	}

	if (!response.ok) {
		const message = payload?.message || rawBody || `Request failed (${response.status})`
		throw new Error(message)
	}

	return payload || {}
}
