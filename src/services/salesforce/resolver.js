import {getSSOLoginRels, isSalesForceSSORel} from '../Data';

SalesforceServiceResolver.preresolve = getSSOLoginRels;
export default async function SalesforceServiceResolver (context, preload) {
	if (context) { return null; }

	const rels = preload ?? await getSSOLoginRels();
	const hasRel = rels.some(isSalesForceSSORel);

	return {
		isSalesforceIntegration: true,
		name: 'salesforce',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false
	};
}
