import { useEffect, useState } from 'react'
import FullPageLoader from '../FullPageLoader/FullPageLoader'
import { APIUrl } from '../../utils/api'

const REQUEST_TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 2500

const wait = (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms)
})

const pingBackend = async () => {
	if (!APIUrl) {
		return true
	}

	const controller = new AbortController()
	const timeoutId = setTimeout(() => {
		controller.abort()
	}, REQUEST_TIMEOUT_MS)

	try {
		// Any HTTP response means the server is reachable and likely awake.
		await fetch(APIUrl, {
			method: 'GET',
			cache: 'no-store',
			signal: controller.signal,
		})
		return true
	} catch {
		return false
	} finally {
		clearTimeout(timeoutId)
	}
}

const BackendWarmupGate = ({ children }) => {
	const [isReady, setIsReady] = useState(false)
	const [attempt, setAttempt] = useState(1)

	useEffect(() => {
		let isCancelled = false

		const warmup = async () => {
			while (!isCancelled) {
				const ready = await pingBackend()

				if (ready) {
					if (!isCancelled) {
						setIsReady(true)
					}
					return
				}

				if (!isCancelled) {
					setAttempt((current) => current + 1)
				}

				await wait(RETRY_DELAY_MS)
			}
		}

		warmup()

		return () => {
			isCancelled = true
		}
	}, [])

	if (!isReady) {
		const label = attempt === 1
			? 'Loading Expense Tracker'
			: `Welcome to Expense Tracker!`

		return <FullPageLoader label={label} />
	}

	return children
}

export default BackendWarmupGate