import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

export resolver from './resolver';

const handles = s => s.isZoomIntegration;
const t = scoped('integrations.services.zoom', {
	name: 'Zoom LTI'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
