export const APIUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiRequest = async (path, options = {}) => {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {}),
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${APIUrl}${path}`, {
		...options,
		headers,
	})

	let payload = null
	try {
		payload = await response.json()
	} catch {
		payload = null
	}

	if (!response.ok) {
		const message = payload?.message || 'Request failed'
		throw new Error(message)
	}

	return payload
}
