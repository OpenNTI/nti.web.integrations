import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {HANDLES} from './Constants';
import Logo from './assets/goto-webinar-logo.jpg';
import Window from './window';

export IfConnected from './if-connected';
export {isConnected, canConnect} from './if-connected/Store';
export UpcomingWebinars from './upcoming-webinars';
export Registration from './registration';
export * as Input from './input';

const handles = s => HANDLES[s.MimeType];
const t = scoped('integrations.services.goto-webinar', {
	name: 'GoToWebinar'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
