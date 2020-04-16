import ItemRegistry from './ItemRegistry.js';

export * as GotoWebinar from './goto-webinar';
export * as Stripe from './stripe';

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
