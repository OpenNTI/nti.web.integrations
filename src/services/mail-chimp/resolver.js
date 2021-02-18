export default function MailChimpServiceResolver(context) {
	if (context) {
		return null;
	}

	return {
		name: 'mail-chimp',
		isMailChimpIntegration: true,
		comingSoon: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false,
	};
}
