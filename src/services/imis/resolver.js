import { getSSOLoginRels, isIMISSSORel } from '../Data';

IMISSSOServiceResolver.preresolve = getSSOLoginRels;
export default async function IMISSSOServiceResolver(context, preload) {
	if (context) {
		return null;
	}

	const rels = preload ?? (await getSSOLoginRels());
	const hasRel = rels.some(isIMISSSORel);

	return {
		isImisIntegration: true,
		name: 'imis',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false,
	};
}
