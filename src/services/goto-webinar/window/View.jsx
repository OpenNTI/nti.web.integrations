import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text} from '@nti/web-commons';

import {View as Connect} from '../../components/connect-window-launcher';
import Description from '../../components/Description';
import WindowContents from '../../components/WindowContents';
import Logo from '../assets/goto-webinar-logo.jpg';


const t = scoped('integrations.services.goto-webinar.window.View', {
	title: 'Connect to GoToWebinar',
	description: 'Host live or pre-recorded webinars.',
	connect: {
		title: 'To Connect GoToWebinar Login with your Account',
		link: 'Login with GoToWebinar'
	}
});

GotoWebinarConnectWindow.propTypes = {
	service: PropTypes.object.isRequired,
	doClose: PropTypes.func
};
export default function GotoWebinarConnectWindow ({service, doClose}) {
	const connected = service.isConnected();

	return (
		<Prompt.BaseWindow doClose={doClose} title={t('title')}>
			<Description logo={Logo}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
				{!connected && (
					<Connect
						service={service}
						title={t('connect.title')}
						link={t('connect.link')}
					/>
				)}
			</WindowContents>
		</Prompt.BaseWindow>
	);
}