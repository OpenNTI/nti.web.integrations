import {getIntegrationsCollection} from '../../utils';

import {HANDLES} from './Constants';

GotoWebinarServiceResolver.preresolve = getIntegrationsCollection;
export default async function GotoWebinarServiceResolver (context, preresolve) {
	if (context) { return null; }

	const collection = preresolve ?? await getIntegrationsCollection();
	const {Items} = collection;

	return Items.find(item => HANDLES[item.MimeType]);
}
