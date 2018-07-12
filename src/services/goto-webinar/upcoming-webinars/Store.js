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

export default class UpcomingWebinarStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('items', null);
		this.set('error', null);
	}


	async load (context, filter) {
		this.set('loading', true);
		this.set('items', null);
		this.set('error', null);
		this.emitChange('loading');

		try {
			const collection = await getIntegrationsCollection(context);
			const integration = getIntegrationFromCollection(collection);

			const upcoming = await integration.fetchLinkParsed('UpcomingWebinars');
			const items = (upcoming || [])
				.filter(filter || (() => true))
				.sort((a, b) => {
					const aSession = a.getNearestSession();
					const bSession = b.getNearestSession();

					if (!aSession && !bSession) {
						return 0;
					} else if (!aSession) {
						return -1;
					} else if (!bSession) {
						return 1;
					} else {
						return aSession.getStartTime() - bSession.getStartTime();
					}
				});

			this.set('loading', false);
			this.set('items', items);
			this.emitChange('loading', items);
		} catch (e) {
			this.set('loading', false);
			this.set('error', e);
			this.emitChange('loading', 'error');
		}
	}
}
