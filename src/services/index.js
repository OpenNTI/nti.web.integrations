import ItemRegistry from './ItemRegistry.js';
import * as Credly from './credly';
import * as Drive from './drive';
import * as GoogleSSO from './google-sso';
import * as GotoWebinar from './goto-webinar';
import * as Scorm from './scorm';
import * as Stripe from './stripe';
import * as Zapier from './zapier';
import * as Zoom from './zoom';

const itemRegister = ItemRegistry.getInstance();

const Services = [
	Credly,
	Drive,
	GoogleSSO,
	GotoWebinar,
	Scorm,
	Stripe,
	Zapier,
	Zoom
];

export {
	Credly,
	Drive,
	GoogleSSO,
	GotoWebinar,
	Scorm,
	Stripe,
	Zapier,
	Zoom
};

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

export function resolveServices (context) {
	const {resolvers} = Services
		.reduce((acc, service) => {
			const {resolver} = service;

			if (!resolver) { return acc; }

			const preresolve = acc.preresolvers.get(resolver.preresolve) || resolver.preresolve?.(context);

			if (resolver.preresolve) {
				acc.preresolvers.set(service.preresolve, preresolve);
			}

			acc.resolvers.push(async () => {
				const preresolved = await preresolve;

				return resolver(context, preresolved);
			});

			return acc;
		}, {resolvers: [], preresolvers: new Map()});

	return Promise.all(
		resolvers.map(r => r())
	);
}
