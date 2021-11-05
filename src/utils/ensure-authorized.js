const Services = {
	'google.com': ensureAuthorizedWithGoogle,
};

/**
 * @param {URL} target
 * @returns {Promise<boolean?>}
 */
export async function ensureAuthorized(target) {
	for (const [host, checker] of Object.entries(Services)) {
		if (target.origin.endsWith(host)) return await checker(target);
	}
}

/**
 * @type {typeof ensureAuthorized}
 */
async function ensureAuthorizedWithGoogle(target) {
	const href = target.toString();
	try {
		const rep = await fetch(href, {
			method: 'HEAD',
			credentials: 'include',
			redirect: 'manual',
			mode: 'cors',
		});

		if (!rep.ok) {
			(alert.native || alert)('You are not authorized');

			// TODO: Open auth and wait on it.

			return false;
		}
	} catch {
		// Cors only activates if the user is logged in??!
	}

	return true;
}
