import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export {default as resolver} from './resolver';

const handles = s => s.isGrowthZoneIntegration;
const t = scoped('integrations.services.growthzone', {
	name: 'Growth Zone SSO'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
