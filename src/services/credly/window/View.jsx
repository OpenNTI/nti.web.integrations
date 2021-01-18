import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text, Hooks} from '@nti/web-commons';

import Description from '../../components/Description';
import WindowContents from '../../components/WindowContents';
import Unavailable from '../../components/Unavailable';
import {Logo} from '../assets';

import Connect from './Connect';
import Disconnect from './Disconnect';

const {useChanges} = Hooks;

const Link = 'https://info.credly.com/';

const t = scoped('integrations.services.credly.window.View', {
	title: 'Connect to Credly Acclaim',
	description: 'Award credentials for course completion through Credly',
	unavailable: {
		title: 'Connecting to Credly is currently unavailable.',
		supportSubject: 'Enabling Credly'
	}
});

CredlyConnectWindow.propTypes = {
	service: PropTypes.shape({
		isEnabled: PropTypes.func,
		isConnected: PropTypes.func
	}),
	doClose: PropTypes.func
};
export default function CredlyConnectWindow ({service, doClose}) {
	useChanges(service);

	let content = null;

	if (!service.isEnabled()) {
		content = (<Unavailable service={service} title={t('unavailable.title')} supportSubject={t('unavailable.supportSubject')} />);
	} else if (service.isConnected()) {
		content = (<Disconnect service={service} doClose={doClose} />);
	} else {
		content = (<Connect service={service} doClose={doClose} />);
	}

	return (
		<Prompt.BaseWindow doClose={doClose} title={t('title')}>
			<Description logo={Logo} link={Link}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
				{content}
			</WindowContents>
		</Prompt.BaseWindow>
	);
}
