import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {Handles} from './Constants';
import {Logo} from './assets';
import Window from './window';

export resolver from './resolver';
export * from './components';

const handles = s => Handles[s.MimeType];
const t = scoped('integrations.services.credly', {
	name: 'Credly Acclaim'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
