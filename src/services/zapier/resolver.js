import { getService } from '@nti/web-client';

export default async function ZapierServiceResolver(context) {
	if (context) {
		return null;
	}

	const service = await getService();
	const hasZapier = Boolean(service.getWorkspace('zapier'));

	return {
		name: 'zapier',
		isZapierIntegration: true,
		// comingSoon: false,
		// earlyAccess: true,
		isEnabled: () => hasZapier,
		hasInfo: () => hasZapier,
		canConnect: () => false,
		isConnected: () => hasZapier,
		canDisconnect: () => false,
	};
}
