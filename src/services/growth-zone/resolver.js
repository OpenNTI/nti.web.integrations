import {getSSOLoginRels, isGrowthZoneSSORel} from '../Data';

GrowthZoneServiceResolver.preresolve = getSSOLoginRels;
export default async function GrowthZoneServiceResolver (context, preload) {
	if (context) { return null; }

	const rels = preload ?? await getSSOLoginRels();
	const hasRel = rels.some(isGrowthZoneSSORel);

	return {
		isGrowthZoneIntegration: true,
		name: 'growthzone',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false
	};
}
