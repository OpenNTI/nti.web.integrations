export default function ZapierServiceResolver(context) {
	if (context) {
		return null;
	}

	return {
		name: 'zapier',
		isZapierIntegration: true,
		comingSoon: true,
		earlyAccess: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false,
	};
}
