import React from 'react';
import {scoped} from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import {Logo} from '../assets';

const t = scoped('integrations.services.zoom.window.View', {
	title: 'Connect to Zoom',
	description: 'Video conference with Learners through Zoom',
	unavailable: {
		title: 'Connecting to Zoom is currently unavailable.',
		supportSubject: 'Enabling Zoom'
	}
});

export default function ZoomConnectWindow (props) {
	return (
		<BaseWindow {...props} logo={Logo} getString={t} />
	);
}