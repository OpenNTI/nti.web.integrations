import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export resolver from './resolver';

const handles = s => s.isCustomIntegration;
const t = scoped('intgrations.services.custom', {
	name: 'Custom Integrations'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
