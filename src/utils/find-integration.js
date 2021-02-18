import getIntegrationsCollection from './get-integrations-collection';

export default async function findIntegration(predicate, context) {
	const integrations = await getIntegrationsCollection(context);

	return integrations.Items.find(predicate);
}
