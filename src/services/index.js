import ItemRegistry from './ItemRegistry.js';
import * as Credly from './credly';
import * as Drive from './drive';
import * as EnterpriseSSO from './enterprise-sso';
import * as GoogleSSO from './google-sso';
import * as GotoWebinar from './goto-webinar';
import * as LTI from './lti';
import * as Scorm from './scorm';
import * as Stripe from './stripe';
import * as YourMembership from './your-membership';
import * as Zapier from './zapier';
import * as Zoom from './zoom';
import * as ZoomLTI from './zoom-lti';

const itemRegister = ItemRegistry.getInstance();

const Services = [
	Credly,
	Drive,
	EnterpriseSSO,
	GoogleSSO,
	GotoWebinar,
	LTI,
	Scorm,
	Stripe,
	YourMembership,
	Zapier,
	Zoom,
	ZoomLTI
];

export {
	Credly,
	Drive,
	EnterpriseSSO,
	GoogleSSO,
	GotoWebinar,
	LTI,
	Scorm,
	Stripe,
	YourMembership,
	Zapier,
	Zoom,
	ZoomLTI
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
