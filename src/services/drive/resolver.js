export default function DriveServiceResolver (context) {
	if (context) { return null; }

	return {
		isDriveIntegration: true,
		name: 'drive',
		isEnabled: () => true,
		canConnect: () => false,
		isConnected: () => true,
		canDisconnect: () => false
	};
}
