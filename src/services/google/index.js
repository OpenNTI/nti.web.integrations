import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

const handles = s => s.isGoogleIntegration;
const t = scoped('integrations.services.google', {
	name: 'Google'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});