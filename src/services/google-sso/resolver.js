import { getSSOLoginRels, isGoogleSSORel } from '../Data';

GoogleSSOServiceResolver.preresolve = getSSOLoginRels;
export default async function GoogleSSOServiceResolver(context, preload) {
	if (context) {
		return null;
	}

	const rels = preload ?? (await getSSOLoginRels());
	const hasRel = rels.some(isGoogleSSORel);

	return {
		isGoogleSSOIntegration: true,
		name: 'google',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false,
	};
}
