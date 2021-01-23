import {Stores} from '@nti/lib-store';

import {findCredlyIntegration} from '../../utils';

export default class AvailableBadgesStore extends Stores.BoundStore {
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
		if (this.context === this.binding) { return; }

		const context = this.context = this.binding;

		this.set({
			loading: true,
			error: null,
			integration: null,
			selectedBadges: null,
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

			const page = integration && await integration.fetchLinkParsed('badges');

			this.set({
				loading: false,
				integration
			});

			this.setPage(page);
		} catch (e) {
			this.set({
				loading: false,
				error: e
			});
		}
	}

	setPage (page) {
		this.set({page});
		this.emitChange(['badges', 'currentPage', 'totalPages']);
	}

	get badges () {
		return this.get('page')?.Items;
	}

	get currentPage () {
		return this.get('page')?.currentPage;
	}

	get totalPages () {
		return this.get('page')?.totalPage;
	}

	get canSetAwardBadge () {
		return this.context.hasLink('badges');
	}
}
