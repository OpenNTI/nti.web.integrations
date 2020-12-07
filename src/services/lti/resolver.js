export default function LTIServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'LTI',
		isLTIIntegration: true,
		isEnabled: () => true,
		canConnect: () => false,
		isConnected: () => true,
		canDisconnect: () => false,
	};
}
