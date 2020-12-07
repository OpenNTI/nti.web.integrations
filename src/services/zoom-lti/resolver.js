export default function ZoomServiceResolver (context) {
	if (context) { return null; }

	return {
		name: 'zoom lti',
		isZoomLTIIntegration: true,
		isEnabled: () => true,
		canConnect: () => false,
		isConnected: () => true,
		canDisconnect: () => false
	};
}
