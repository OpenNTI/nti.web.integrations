import {getService} from '@nti/web-client';

export default async function SCORMServiceResolver (context) {
	if (context) { return null; }

	const service = await getService();
	const hasScorm = Boolean(service.getWorkspace('SCORM'));

	return {
		isScormIntegration: true,
		name: 'scorm',
		isEnables: () => hasScorm,
		canConnect: () => false,
		isConnected: () => hasScorm,
		canDisconnect: () => false
	};
}
