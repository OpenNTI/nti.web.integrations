import React from 'react';

import { scoped } from '@nti/lib-locale';

import BaseWindow from '../../components/BaseWindow';
import { Logo } from '../assets';

const link = 'https://stripe.com/';

const t = scoped('integrations.services.stripe.window.View', {
	title: 'Connect to Stripe',
	description: "Process payments with Stripe's robust suite of options.",
	connect: {
		title: 'To Connect to Stripe Login with your Account',
		link: 'Login with Stripe',
	},
	disconnect: {
		title: 'Stripe is Connected!',
		accountLabel: 'Stripe Account: ',
		link: 'Disconnect Stripe',
	},
	unavailable: {
		title: 'Connecting to Stripe is currently unavailable.',
		supportSubject: 'Enabling Stripe',
	},
});

export default function StripeConnectWindow(props) {
	return <BaseWindow {...props} logo={Logo} getString={t} link={link} />;
}
