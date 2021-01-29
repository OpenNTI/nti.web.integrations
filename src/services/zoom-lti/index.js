import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Logo} from './assets';
import Window from './window';

export { default as resolver } from './resolver';

const handles = s => s.isZoomLTIIntegration;
const t = scoped('integrations.services.zoom-lti', {
	name: 'Zoom LTI'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
