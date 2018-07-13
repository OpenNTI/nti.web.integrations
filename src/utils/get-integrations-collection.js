import {getService} from '@nti/web-client';
import {Models} from '@nti/lib-interfaces';

async function getGlobalIntegrationsCollection () {
	const service = await getService();
	const collection = await service.getCollection('Integrations', 'Integration').refresh();

	return collection;
}

async function getContextIntegrationsCollection (context) {
	const service = await getService();
	const collection = await context.fetchLink('Integrations');

	return Models.WorkspaceCollection.List(service, context, [collection])[0];
}

export default async function getIntegrationsCollection (context) {
	return context && context.hasLink('Integrations') ? getContextIntegrationsCollection(context) : getGlobalIntegrationsCollection();
}
