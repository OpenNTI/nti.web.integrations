import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

export default class IntegrationListStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', false);
		this.set('items', null);
		this.set('error', null);
	}


	async load () {
		this.set('loading', true);
		this.set('items', null);
		this.set('error', null);
		this.emitChange('loading', 'items', 'error');

		try {
			const service = await getService();
			const collection = await service.getCollection('Integrations', 'Integration').refresh();

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
}
