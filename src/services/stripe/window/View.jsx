import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text} from '@nti/web-commons';

import {View as Connect} from '../../components/connect-window-launcher';
import Description from '../../components/Description';
import Unavailable from '../../components/Unavailable';
import WindowContents from '../../components/WindowContents';
import Logo from '../assets/stripe-logo.png';

const t = scoped('integrations.services.stripe.window.View', {
	title: 'Connect to Stripe',
	description: 'Process payments with Stripe\'s robust suite of options.',
	connect: {
		title: 'To Connect to Stripe Login with your Account',
		link: 'Login with Stripe'
	},
	unavailable: {
		title: 'Connecting to Stripe is currently unavailable.',
		supportSubject: 'Enabling Stripe'
	}
});

StripeConnectWindow.propTypes = {
	service: PropTypes.shape({
		isConnected: PropTypes.func,
		isEnabled: PropTypes.func
	}).isRequired,
	doClose: PropTypes.func
};
export default function StripeConnectWindow ({service, doClose}) {
	const connected = service.isConnected();
	const isEnabled = service.isEnabled();

	let content = null;

	if (!isEnabled) {
		content = (
			<Unavailable service={service} title={t('unavailable.title')} supportSubject={t('unavailable.supportSubject')} />
		);
	} else if (connected) {
		content = (
			<Connect service={service} title={t('connect.title')} link={t('connect.link')} />
		);
	} else {
		content = (
			<div>
				Disconnect Stripe
			</div>
		);
	}

	return (
		<Prompt.BaseWindow doClose={doClose} title={t('title')}>
			<Description logo={Logo}>
				<Text.Base>{t('description')}</Text.Base>
			</Description>
			<WindowContents>
				{content}
			</WindowContents>
		</Prompt.BaseWindow>
	);
}