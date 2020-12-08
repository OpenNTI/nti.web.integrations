import {getSSOLoginRels, isFontevaSSORel} from '../Data';

FontevaServiceResolver.preresolve = getSSOLoginRels;
export default async function FontevaServiceResolver (context, preload) {
	if (context) { return null; }

	const rels = preload ?? await getSSOLoginRels();
	const hasRel = rels.some(isFontevaSSORel);

	return {
		isFontevaIntegration: true,
		name: 'fonteva',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false
	};
}
