import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Text} from '@nti/web-commons';

import {View as Connect} from './connect-window-launcher';
import Description from './Description';
import Unavailable from './Unavailable';
import WindowContents from './WindowContents';


BaseServiceWindow.propTypes = {
	service: PropTypes.shape({
		isConnected: PropTypes.func,
		isEnabled: PropTypes.func
	}).isRequired,
	logo: PropTypes.any,
	doClose: PropTypes.func,
	getString: PropTypes.func.isRequired
};
export default function BaseServiceWindow ({service, logo, doClose, getString: t}) {
	const connected = service.isConnected();
	const isEnabled = service.isEnabled();

	let content = null;

	if (!isEnabled) {
		content = (
			<Unavailable service={service} title={t('unavailable.title')} supportSubject={t('unavailable.supportSubject')} />
		);
	} else if (connected) {
		content = (
			<div>
				Disconnect Integration
			</div>
		);
	} else {
		content = (
			<Connect service={service} title={t('connect.title')} link={t('connect.link')} />
		);
	}

	return (
		<Prompt.BaseWindow doClose={doClose} title={t('title')}>
			<Description logo={logo}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
				{content}
			</WindowContents>
		</Prompt.BaseWindow>
	);

}