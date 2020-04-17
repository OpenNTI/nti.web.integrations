import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text} from '@nti/web-commons';

import Description from '../../components/Description';
import WindowContents from '../../components/WindowContents';
import Logo from '../assets/goto-webinar-logo.jpg';


const t = scoped('integrations.services.goto-webinar.window.View', {
	title: 'Connect to GoToWebinar',
	description: 'Host live or pre-recorded webinars.'
});

GotoWebinarConnectWindow.propTypes = {
	service: PropTypes.object.isRequired,
	onDismiss: PropTypes.func
};
export default function GotoWebinarConnectWindow ({service, onDismiss}) {
	return (
		<Prompt.BaseWindow doClose={onDismiss} title={t('title')}>
			<Description logo={Logo}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
			</WindowContents>
		</Prompt.BaseWindow>
	);
}