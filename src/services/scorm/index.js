import { scoped } from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import { Logo } from './assets';
import Window from './window';

export { default as resolver } from './resolver';

const handles = s => s.isScormIntegration;
const t = scoped('integrations.services.scorm', {
	name: 'SCORM',
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name'),
});
