export default function CredilyServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'credly',
		isCredilyIntegration: true,
		comingSoon: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false
	};
}
