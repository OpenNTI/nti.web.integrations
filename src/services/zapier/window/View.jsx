import React from 'react';
import {scoped} from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import {Logo} from '../assets';

import SubscriptionList from './SubscriptionList';

const Link = 'https://zapier.com/home';

const t = scoped('integrations.services.zapier.window.View', {
	title: 'Zapier',
	description: 'Connect to other apps with Zapier workflows',
	unavailable: {
		title: 'Connecting to Zapier is currently unavailable.',
		supportSubject: 'Enabling Zapier'
	}
});

export default function ZapierConnectWindow (props) {
	return (
		<BaseWindow {...props} logo={Logo} link={Link} getString={t}>
			<SubscriptionList />
		</BaseWindow>
	);
}
