import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

const handles = s => s.isCredilyIntegration;
const t = scoped('integrations.services.credly', {
	name: 'Credly'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});