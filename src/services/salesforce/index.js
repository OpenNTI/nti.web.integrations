import { scoped } from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import { Logo } from './assets';

export { default as resolver } from './resolver';

const handles = s => s.isSalesforceIntegration;
const t = scoped('integrations.services.salesforce', {
	name: 'Salesforce SSO',
});

Registry.register(handles)({
	Logo,
	name: t('name'),
});
