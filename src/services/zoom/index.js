import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

const handles = s => s.isZoomIntegration;
const t = scoped('integrations.services.zoom', {
	name: 'Zoom'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});