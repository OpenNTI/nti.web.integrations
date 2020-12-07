export default function ZoomServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'zoom',
		isZoomIntegration: true,
		comingSoon: true,
		isEnabled: () => true,
		canConnect: () => false,
		isConnected: () => true,
		canDisconnect: () => false
	};
}
