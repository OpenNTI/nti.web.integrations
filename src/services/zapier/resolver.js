export default function ZapierServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'zapier',
		isZapierIntegration: true,
		// comingSoon: true,
		earlyAccess: true,
		hasDetails: () => true,
		isEnabled: () => true,
		canConnect: () => false,
		isConnected: () => true,
		canDisconnect: () => false
	};
}
