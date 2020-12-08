import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export resolver from './resolver';

const handles = s => s.isImisIntegration;
const t = scoped('intgrations.services.imis', {
	name: 'IMIS'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
