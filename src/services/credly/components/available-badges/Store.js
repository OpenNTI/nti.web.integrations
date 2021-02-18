import { Stores, Interfaces } from '@nti/lib-store';

import { findCredlyIntegration } from '../../utils';

const Sorts = {
	name: 'name',
	created: '-created_at',
	issued: 'badges_count',
	updated: '-updated_at',
};
class AvailableBadgesStore extends Stores.BoundStore {
	constructor() {
		super();

		this.set({
			loading: true,
			activeSort: 'name',
		});
	}

	sorts = Object.keys(Sorts);

	setSort(sort) {
		this.set({
			activeSort: sort,
		});

		this.load();
	}

	reload() {
		delete this.context;
		this.load();
	}

	async load() {
		if (
			this.context === this.binding &&
			this.lastSearchTerm === this.searchTerm &&
			this.lastSort === this.get('activeSort')
		) {
			return;
		}

		const context = (this.context = this.binding);
		const searchTerm = (this.lastSearchTerm = this.searchTerm);
		const activeSort = (this.lastSort = this.get('activeSort'));

		this.set({
			loading: true,
			error: null,
			page: null,
			notConnected: false,
		});

		try {
			const integration = await findCredlyIntegration(context);

			if (!integration.isConnected()) {
				this.set({
					loading: false,
					integration,
					notConnected: true,
				});
				return;
			}

			const params = {
				sort: Sorts[activeSort],
			};

			if (searchTerm) {
				params.filter = searchTerm;
			}

			const page =
				integration &&
				(await integration.fetchLinkParsed('badges', params));

			this.set({
				loading: false,
				integration,
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	#setPage(page) {
		this.set({
			page,
			badges: page?.Items,
			currentPage: page?.currentPage,
			totalPages: page?.totalPages,
		});
	}

	async loadPage(pageNumber) {
		const integration = this.get('integration');

		this.set({
			loading: true,
			currentPage: pageNumber,
		});

		try {
			const params = {
				page: pageNumber,
				sort: Sorts[this.get('activeSort')],
			};

			if (this.searchTerm) {
				params.filter = this.searchTerm;
			}

			const page =
				integration &&
				(await integration.fetchLinkParsed('badges', params));

			this.set({
				loading: false,
			});

			this.#setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e,
			});
		}
	}

	get canSetAwardBadge() {
		return this.context.hasLink('badges');
	}
}

export default Interfaces.Searchable(AvailableBadgesStore);
