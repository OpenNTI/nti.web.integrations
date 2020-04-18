import ItemRegistry from './ItemRegistry.js';

export * as Credly from './credly';
export * as Drive from './drive';
export * as Google from './google';
export * as GotoWebinar from './goto-webinar';
export * as Scorm from './scorm';
export * as Stripe from './stripe';
export * as Zapier from './zapier';
export * as Zoom from './zoom';

const itemRegister = ItemRegistry.getInstance();

export function getItemFor (service) {
	return itemRegister.getItemFor(service);
}

export function getLogoFor (service) {
	return getItemFor(service)?.Logo;
}

export function getWindowFor (service) {
	return getItemFor(service)?.Window;
}

export function getNameFor (service) {
	return getItemFor(service)?.name;
}
