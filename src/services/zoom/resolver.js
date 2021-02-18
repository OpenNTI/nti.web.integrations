export default function ZoomServiceResolver(context) {
	if (context) {
		return null;
	}

	return {
		name: 'zoom',
		isZoomIntegration: true,
		comingSoon: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false,
	};
}
