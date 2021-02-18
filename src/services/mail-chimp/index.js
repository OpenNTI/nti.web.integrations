import { scoped } from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import { Logo } from './assets';

export { default as resolver } from './resolver';

const handles = s => s.isMailChimpIntegration;
const t = scoped('integrations.services.mail-chimp', {
	name: 'Mail Chimp',
});

Registry.register(handles)({
	Logo,
	name: t('name'),
});
