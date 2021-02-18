import { getIntegrationsCollection } from '../../utils';

import { Handles } from './Constants';

StripeServiceResolver.preresolve = getIntegrationsCollection;
export default async function StripeServiceResolver(context, preresolve) {
	if (context) {
		return null;
	}

	const collection = preresolve ?? (await getIntegrationsCollection());
	const { Items } = collection;

	return Items.find(item => Handles[item.MimeType]);
}
