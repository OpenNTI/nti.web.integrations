
import { scoped } from '@nti/lib-locale';
import { rawContent } from '@nti/lib-commons';

import BaseWindow from '../../components/BaseWindow';
import { Logo } from '../assets';

const Link = 'https://zapier.com/home';

const t = scoped('integrations.services.zapier.window.View', {
	title: 'Connect to Zapier',
	description: 'Connect to other apps with Zapier workflows',
	unavailable: {
		title: 'Connecting to Zapier is currently unavailable.',
		supportSubject: 'Enabling Zapier',
	},
	info: `Visit <a href="${Link}" rel="noopener noreferrer" target="_blank">zapier.com</a> to connect other apps and set up workflows.`
});

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 94px var(--side-padding, 2rem);

	a {
		color: var(--primary-blue);
		cursor: pointer;
		text-decoration: none;
	}
`

export default function ZapierConnectWindow(props) {
	return (
		<BaseWindow {...props} logo={Logo} link={Link} getString={t}>
			<Content>
				<div {...rawContent(t('info'))} />
			</Content>
		</BaseWindow>
	);
}
