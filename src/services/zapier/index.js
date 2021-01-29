import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

export { default as resolver } from './resolver';

const handles = s => s.isZapierIntegration;
const t = scoped('integrations.services.zapier', {
	name: 'Zapier'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
