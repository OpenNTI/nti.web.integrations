import React from 'react';
import {scoped} from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import {Logo} from '../assets';

const t = scoped('integrations.services.drive.window.View', {
	title: 'Connect to Drive',
	description: 'Link to document from your google drive',
	unavailable: {
		title: 'Connecting to Drive is currently unavailable.',
		supportSubject: 'Enabling Drive'
	}
});

export default function DriveConnectWindow (props) {
	return (
		<BaseWindow {...props} logo={Logo} getString={t} />
	);
}