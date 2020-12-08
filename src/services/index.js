import ItemRegistry from './ItemRegistry.js';
import * as Credly from './credly';
import * as Custom from './custom';
import * as Drive from './drive';
import * as EnterpriseSSO from './enterprise-sso';
import * as Fonteva from './fonteva';
import * as GoogleSSO from './google-sso';
import * as GotoWebinar from './goto-webinar';
import * as Imis from './imis';
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
	Custom,
	Drive,
	EnterpriseSSO,
	Fonteva,
	GoogleSSO,
	GotoWebinar,
	Imis,
	LTI,
	Scorm,
	Stripe,
	YourMembership,
	Zapier,
	// Zoom,
	ZoomLTI
];

export {
	Credly,
	Custom,
	Drive,
	EnterpriseSSO,
	Fonteva,
	GoogleSSO,
	GotoWebinar,
	Imis,
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

			//Note: resolvers can define a preresolve method, to load the data it will need. The idea here
			//it that since different locations may need the same data, they can import a shared resolver and
			//share the result. This lets us keep the resolvers separate without incurring the extra load costs.
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
