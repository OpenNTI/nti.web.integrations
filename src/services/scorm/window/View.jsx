
import { scoped } from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import { Logo } from '../assets';

const Link = 'https://scorm.com/';

const t = scoped('integrations.services.scorm.window.View', {
	title: 'Connect to Scorm',
	description: 'Link to scorm packages from a course',
	unavailable: {
		title: 'Connecting to Scorm is currently unavailable.',
		supportSubject: 'Enabling Scorm',
	},
});

export default function ScormConnectWindow(props) {
	return <BaseWindow {...props} logo={Logo} link={Link} getString={t} />;
}
