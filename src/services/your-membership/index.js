import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';

export { default as resolver } from './resolver';

const handles = s => s.isYourMembershipIntegration;
const t = scoped('intgrations.services.your-membership', {
	name: 'YM SSO'
});

Registry.register(handles)({
	Logo,
	name: t('name')
});
