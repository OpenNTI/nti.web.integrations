function makePreview (id, name) {
	return {
		name,
		[id]: true,
		isEnabled: () => false,
		canConnect: () => false,
		isConnected: () => false,
		canDisconnect: () => false
	};
}

const credly = makePreview('isCredilyIntegration', 'credly');
const drive = makePreview('isDriveIntegration', 'drive');
const google = makePreview('isGoogleIntegration', 'google');
const scorm = makePreview('isScormIntegration', 'scorm');
const zapier = makePreview('isZapierIntegration', 'zapier');
const zoom = makePreview('isZoomIntegration', 'zoom');

export default function getPreviewItems (context) {
	if (context) { return null; }

	return [
		credly,
		drive,
		google,
		scorm,
		zapier,
		zoom
	];
}