import {Stores, Interfaces} from '@nti/lib-store';

import {findCredlyIntegration} from '../../utils';

class AvailableBadgesStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: true
		});
	}

	reload () {
		delete this.context;
		this.load();
	}

	async load () {
		if (
			this.context === this.binding &&
			this.lastSearchTerm === this.searchTerm
		) { return; }

		const context = this.context = this.binding;
		const searchTerm = this.lastSearchTerm = this.searchTerm;

		this.set({
			loading: true,
			error: null,
			page: null,
			notConnected: false
		});

		try {
			const integration = await findCredlyIntegration(context);

			if (!integration.isConnected()) {
				this.set({
					loading: false,
					integration,
					notConnected: true
				});
				return;
			}

			const params = {};

			if (searchTerm) {
				params.filter = searchTerm;
			}

			const page = integration && await integration.fetchLinkParsed('badges', params);

			this.set({
				loading: false,
				integration
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	#setPage (page) {
		this.set({
			page,
			badges: page?.Items,
			currentPage: page?.currentPage,
			totalPages: page?.totalPages
		});
	}

	async loadPage (pageNumber) {
		const integration = this.get('integration');

		this.set({
			loading: true,
			currentPage: pageNumber
		});

		try {
			const params = {
				page: pageNumber
			};

			if (this.searchTerm) {
				params.filter = this.searchTerm;
			}

			const page = integration && await integration.fetchLinkParsed('badges', params);

			this.set({
				loading: false
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	get canSetAwardBadge () {
		return this.context.hasLink('badges');
	}
}

export default Interfaces.Searchable(AvailableBadgesStore);
