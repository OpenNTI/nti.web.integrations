import {Stores} from '@nti/lib-store';

export class BadgesStore extends Stores.BoundStore {
	async load () {
		if (this.binding === this.context) { return; }

		const context = this.context = this.binding;

		this.set({
			loading: true,
			error: null,
			page: null
		});

		try {
			const page = await context.fetchLinkParsed(this.rel);

			this.set({
				loading: false
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
		return this.get('page')?.badges;
	}

	get currentPage () {
		return this.get('page')?.currentPage;
	}

	get totalPages () {
		return this.get('page')?.totalPages;
	}

	get canAddBadges () {
		return this.binding.hasLink('Integrations');
	}
}

export class AwardedBadgesStore extends Badges {
	rel = 'awarded-badges'
}

export class AwardsBadgesStore extends Badges {
	rel = 'badges'
}
