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

export async function isConnected (context) {
	const collection = await getIntegrationsCollection(context);
	const integration = getIntegrationsCollection(collection);

	return integration && integration.isConnected();
}

export async function canConnect (context) {
	const collection = await getIntegrationsCollection(context);
	const integration = getIntegrationsCollection(collection);

	return integration && integration.hasLink('authorize.webinar');
}

export default class GotoWebinarIsConnectedStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('loading', null);
		this.set('integration', null);
		this.set('connected', null);
		this.set('canConnect', null);
		this.set('error', null);
	}

	async load (context) {
		this.set('loading', true);
		this.set('connected', null);
		this.set('error', null);
		this.emitChange('loading', 'connected', 'error');

		try {
			const collection = await getIntegrationsCollection(context);

			if (this.unsubscribeFromCollection) {
				this.unsubscribeFromCollection();
			}

			collection.addListener('change', this.onCollectionChange);

			this.unsubscribeFromCollection = () => {
				collection.removeListener('change', this.onCollectionChange);
				delete this.unsubscribeFromCollection;
			};

			this.setIntegrationFromCollection(collection);
		} catch (e) {
			this.set('loading', false);
			this.set('error', e);
			this.emitChange('loading', 'error');
		}
	}


	unload () {
		if (this.unsubscribeFromCollection) {
			this.unsubscribeFromCollection();
		}
	}


	onCollectionChange = (collection) => {
		this.setIntegrationFromCollection(collection);
	}


	setIntegrationFromCollection (collection) {
		const integration = getIntegrationFromCollection(collection);

		this.set('loading', false);
		this.set('integration', integration);
		this.set('connected', integration && integration.isConnected());
		this.set('canConnect', integration && integration.hasLink('authorize.webinar'));
		this.emitChange('loading', 'connected', 'canConnect');
	}
}
