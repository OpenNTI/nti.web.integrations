import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

const handles = s => s.isDriveIntegration;
const t = scoped('integrations.services.drive', {
	name: 'Drive'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});