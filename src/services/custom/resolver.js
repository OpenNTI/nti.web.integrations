export default function CustomServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'custom',
		isCustomIntegration: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false
	};
}
