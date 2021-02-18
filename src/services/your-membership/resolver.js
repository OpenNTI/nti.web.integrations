import { getSSOLoginRels, isYourMembershipSSORel } from '../Data';

YourMembershipServiceResolver.preresolve = getSSOLoginRels;
export default async function YourMembershipServiceResolver(context, preload) {
	if (context) {
		return null;
	}

	const rels = preload ?? (await getSSOLoginRels());
	const hasRel = rels.some(isYourMembershipSSORel);

	return {
		isYourMembershipIntegration: true,
		name: 'your membership',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false,
	};
}
