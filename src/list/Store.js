import {Stores} from '@nti/lib-store';

import {getIntegrationsCollection} from '../utils';

export default class IntegrationListStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('items', null);
		this.set('error', null);
	}


	async load (context) {
		this.set('loading', true);
		this.set('items', null);
		this.set('error', null);
		this.emitChange('loading', 'items', 'error');

		try {
			const collection = await getIntegrationsCollection(context);

			if (this.unsubscribeFromCollection) {
				this.unsubscribeFromCollection();
			}

			collection.addListener('change', this.onCollectionChange);

			this.unsubscribeFromCollection = () => collection.removeListener('change', this.onCollectionChange);

			this.set('loading', false);
			this.set('items', collection.Items);
			this.set('error', null);
			this.emitChange('loading', 'items', 'error');
		} catch (e) {
			this.set('loading', false);
			this.set('items', null);
			this.set('error', e);
			this.emitChange('loading', 'items', 'error');
		}
	}


	unload () {
		if (this.unsubscribeFromCollection) { this.unsubscribeFromCollection(); }
	}


	onCollectionChange = (collection) => {
		this.set('items', collection.Items);
		this.emitChange('items');
	}
}
