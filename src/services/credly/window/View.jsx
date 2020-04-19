import React from 'react';
import {scoped} from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import {Logo} from '../assets';

const Link = 'https://info.credly.com/';

const t = scoped('integrations.services.credly.window.View', {
	title: 'Connect to Credly',
	description: 'Award credentials for course completion through Credly',
	unavailable: {
		title: 'Connecting to Credly is currently unavailable.',
		supportSubject: 'Enabling Credly'
	}
});

export default function CredlyConnectWindow (props) {
	return (
		<BaseWindow {...props} logo={Logo} link={Link} getString={t} />
	);
}