import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Handles} from './Constants';
import Logo from './assets/stripe-logo.png';
import Window from './window';

const handles = s => Handles[s.MimeType];
const t = scoped('integrations.servics.stripe', {
	name: 'Stripe'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});