import {scoped} from '@nti/lib-locale';

import Registry from '../ItemRegistry';

import {HANDLES} from './Constants';
import {Logo} from './assets';
import Window from './window';

export { default as IfConnected } from './if-connected';
export {isConnected, canConnect} from './if-connected/Store';
export { default as UpcomingWebinars } from './upcoming-webinars';
export { default as Registration } from './registration';
export * as Input from './input';
export { default as resolver } from './resolver';

const handles = s => HANDLES[s.MimeType];
const t = scoped('integrations.services.goto-webinar', {
	name: 'GoToWebinar'
});

Registry.register(handles)({
	Logo,
	Window,
	name: t('name')
});
