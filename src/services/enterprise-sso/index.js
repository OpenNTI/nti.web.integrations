import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export resolver from './resolver';

const handles = s => s.isEnterpriseSSOIntegration;
const t = scoped('intgrations.services.enterprise-sso', {
	name: 'Enterprise SSO'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
