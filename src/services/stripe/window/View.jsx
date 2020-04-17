import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Text} from '@nti/web-commons';

import Description from '../../components/Description';
import WindowContents from '../../components/WindowContents';
import Logo from '../assets/stripe-logo.png';


const t = scoped('integrations.services.stripe.window.View', {
	title: 'Connect to Stripe',
	description: 'Process payments with Stripe\'s robust suite of options.'
});

StripeConnectWindow.propTypes = {
	service: PropTypes.object.isRequired,
	onDismiss: PropTypes.func
};
export default function StripeConnectWindow ({service, onDismiss}) {
	return (
		<Prompt.BaseWindow doClose={onDismiss} title={t('title')}>
			<WindowContents>
				<Description logo={Logo}>
					<Text.Base>{t('description')}</Text.Base>
				</Description>
			</WindowContents>
		</Prompt.BaseWindow>
	);
}