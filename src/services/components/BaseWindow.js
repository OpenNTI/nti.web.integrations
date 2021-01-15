import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Text} from '@nti/web-commons';

import {View as Connect} from './connect-window-launcher';
import {View as Disconnect} from './disconnect';
import Description from './Description';
import Unavailable from './Unavailable';
import WindowContents from './WindowContents';

function getStringWrapper (getString) {
	return (name, props) => {
		if (getString.isMissing(name)) { return null; }

		return getString(name, props);
	};
}


BaseServiceWindow.propTypes = {
	service: PropTypes.shape({
		isConnected: PropTypes.func,
		isEnabled: PropTypes.func
	}).isRequired,
	logo: PropTypes.any,
	link: PropTypes.string,
	doClose: PropTypes.func,
	getString: PropTypes.func.isRequired
};
export default function BaseServiceWindow ({service, logo, link, doClose, getString, children}) {
	const t = getStringWrapper(getString);

	const connected = service.isConnected();
	const isEnabled = service.isEnabled();

	let content = React.Children.count(children) ? children : null;

	if (!content) {
		if (!isEnabled) {
			content = (
				<Unavailable service={service} title={t('unavailable.title')} supportSubject={t('unavailable.supportSubject')} />
			);
		} else if (connected) {
			content = (
				<Disconnect service={service} title={t('disconnect.title')} accountLabel={t('disconnect.accountLabel')} link={t('disconnect.link')} />
			);
		} else {
			content = (
				<Connect service={service} title={t('connect.title')} link={t('connect.link')} />
			);
		}
	}

	return (
		<Prompt.BaseWindow doClose={doClose} title={t('title')}>
			<Description logo={logo} link={link}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
				{content}
			</WindowContents>
		</Prompt.BaseWindow>
	);

}