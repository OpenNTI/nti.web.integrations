import {Stores} from '@nti/lib-store';

import {getIntegrationsCollection} from '../../../utils';
import {HANDLES} from '../Constants';

function getIntegrationFromCollection (collection) {
	const {Items} = collection;

	for (let item of Items) {
		if (HANDLES[item.MimeType]) {
			return item;
		}
	}
}

export default class GoToWebinarInputStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('items', null);
		this.set('error', null);
	}


	async resolve (context, url) {
		this.set('loading', true);
		this.set('items', null);
		this.set('error', null);
		this.emitChange('loading');

		if(!this.integration) {
			const collection = await getIntegrationsCollection(context);
			this.integration = getIntegrationFromCollection(collection);
		}

		try {
			const webinar = await this.integration.fetchLinkParsed('ResolveWebinar', {webinar: url});

			this.set('loading', false);
			this.set('webinar', webinar);
			this.emitChange('loading', 'webinar');

			return webinar;
		} catch (e) {
			this.set('loading', false);
			this.set('error', e.message || e);
			this.emitChange('loading', 'error');

			return Promise.reject(e.message || e);
		}
	}
}
