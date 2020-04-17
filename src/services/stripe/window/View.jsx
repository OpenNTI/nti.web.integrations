import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text} from '@nti/web-commons';

import {View as Connect} from '../../components/connect-window-launcher';
import Description from '../../components/Description';
import WindowContents from '../../components/WindowContents';
import Logo from '../assets/stripe-logo.png';

const t = scoped('integrations.services.stripe.window.View', {
	title: 'Connect to Stripe',
	description: 'Process payments with Stripe\'s robust suite of options.',
	connect: {
		title: 'To Connect to Stripe Login with your Account',
		link: 'Login with Stripe'
	}
});

StripeConnectWindow.propTypes = {
	service: PropTypes.shape({
		isConnected: PropTypes.func
	}).isRequired,
	onDismiss: PropTypes.func
};
export default function StripeConnectWindow (props) {
	const {service, onDismiss} = props;
	const connected = service.isConnected();

	return (
		<Prompt.BaseWindow doClose={onDismiss} title={t('title')}>
			<WindowContents>
				<Description logo={Logo}>
					<Text.Base>{t('description')}</Text.Base>
				</Description>
				{!connected && (
					<Connect
						service={service}
						title={t('connect.title')}
						link={t('connect.link')}
					/>
				)}
				{connected && (
					<div>
						Disconnect Stripe
					</div>
				)}
			</WindowContents>
		</Prompt.BaseWindow>
	);
}