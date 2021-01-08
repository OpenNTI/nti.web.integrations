import {getIntegrationsCollection} from '../../utils';

import {Handles} from './Constants';

CredilyServiceResolver.presolve = getIntegrationsCollection;
export default async function CredilyServiceResolver (context, preresolve) {
	if (context) { return null; }

	const collection = preresolve ?? await getIntegrationsCollection();
	const {Items} = collection;

	return Items.find(item => Handles[item.MimeType]);
}
