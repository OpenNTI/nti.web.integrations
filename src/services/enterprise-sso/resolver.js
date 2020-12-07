import {getSSOLoginRels, isEnterpriseSSO} from '../Data';

EnterpriseSSOService.preresolve = getSSOLoginRels;
export default async function EnterpriseSSOService (context, preload) {
	if (context) { return null; }

	const rels = preload ?? await getSSOLoginRels();
	const hasRel = rels.some(isEnterpriseSSO);

	return {
		isEnterpriseSSOIntegration: true,
		name: 'enterprise-sso',
		isEnabled: () => hasRel,
		canConnect: () => false,
		isConnected: () => hasRel,
		canDisconnect: () => false
	};
}
