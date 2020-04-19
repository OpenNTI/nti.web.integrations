import React from 'react';
import {scoped} from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import {Logo} from '../assets';

const Link = 'https://www.gotomeeting.com/webinar';

const t = scoped('integrations.services.goto-webinar.window.View', {
	title: 'Connect to GoToWebinar',
	description: 'Host live or pre-recorded webinars.',
	connect: {
		title: 'To Connect GoToWebinar Login with your Account',
		link: 'Login with GoToWebinar'
	},
	disconnect: {
		title: 'GoToWebinar is Connected!',
		accountLabel: 'GoToWebinar Account: ',
		link: 'Disconnect GoToWebinar'	
	},
	unavailable: {
		title: 'Connecting GoToWebinar is currently unavailable.',
		supportSubject: 'Enabling GoToWebinar'
	}
});

export default function GotoWebinarConnectWindow (props) {
	return (
		<BaseWindow {...props} logo={Logo} link={Link} getString={t} />
	);
}