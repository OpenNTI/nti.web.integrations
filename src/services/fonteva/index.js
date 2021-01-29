import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export { default as resolver } from './resolver';

const handles = s => s.isFontevaIntegration;
const t = scoped('intgrations.services.fonteva', {
	name: 'Fonteva SSO'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
