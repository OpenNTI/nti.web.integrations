
import { scoped } from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import { Logo } from '../assets';

const t = scoped('integrations.services.google.window.View', {
	title: 'Connect to Google',
	description: 'Allow Learners to log in with their Google account',
	unavailable: {
		title: 'Connecting to Google is currently unavailable.',
		supportSubject: 'Enabling Google',
	},
});

export default function GoogleConnectWindow(props) {
	return <BaseWindow {...props} logo={Logo} getString={t} />;
}
