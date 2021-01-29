import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export { default as resolver } from './resolver';

const handles = s => s.isLTIIntegration;
const t = scoped('intgrations.services.lti', {
	name: 'LTI'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
