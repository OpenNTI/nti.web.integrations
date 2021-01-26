import {Stores} from '@nti/lib-store';


const getBadges = p => p?.badges ?? p?.Items ?? [];
const getCurrentPage = p => p?.currentPage;
const getTotalPages = p => p?.totalPages;
export class BadgesStore extends Stores.BoundStore {
	async load () {
		if (this.binding.context === this.context) { return; }

		const context = this.context = this.binding.context;

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
		this.set({
			page,
			badges: getBadges(page)
		});
		this.emitChange(['badges', 'currentPage', 'totalPages']);
	}

	get currentPage () {
		return getCurrentPage(this.get('page')) ?? 0;
	}

	get totalPages () {
		return getTotalPages(this.get('page')) ?? 1;
	}

	get readOnly () {
		return this.binding.readOnly;
	}

	get canAddBadges () {
		return !this.readOnly && this.context?.hasLink('Integrations');
	}


	async addBadge (badge) {
		const payload = {
			...badge.toJSON(),
			MimeType: badge.MimeType,
			Class: badge.Class
		};
		const resp = await this.context.postToLink('badges', payload, true);

		this.set({
			badges: [...this.get('badges'), resp]
		});
	}

	canRemoveBadge (badge) {
		return !this.readOnly && badge.hasLink('delete');
	}

	async removeBadge (badge) {
		const removeId = badge.getID();
		const existing = this.get('badges');

		this.setImmediate({
			badges: existing.filter(b => b.getID() !== removeId)
		});

		try {
			await badge.delete('delete');
		} catch (e) {
			this.set({badges: existing, error: e});
		}
	}
}

export class AwardedBadgesStore extends BadgesStore {
	static hasBadges (c) { return c.hasLink('awarded_badges'); }

	rel = 'awarded_badges'
}

export class AwardsBadgesStore extends BadgesStore {
	static hasBadges (c) { return c.hasLink('awarded_badges'); }

	rel = 'badges'
}
